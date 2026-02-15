'use client';

import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, animate, PanInfo } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useHomeScreen, FolderItem, AppItem } from '@/context/HomeScreenContext';
import { useSessionBrain } from '@/context/SessionBrainContext';
import { X, Pencil } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { DraggableAppIcon } from './DraggableAppIcon';
import { springs, motionConfig } from '@/components/motion/config';

interface AppFolderProps {
  folder: FolderItem;
  index: number;
  delay?: number;
}

// Long press duration (ms) to enter edit mode
const LONG_PRESS_DURATION = 500;

export function AppFolder({ folder, index, delay = 0 }: AppFolderProps) {
  const folderRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [folderName, setFolderName] = useState(folder.name);

  const {
    isEditMode,
    enterEditMode,
    openFolderId,
    openFolder,
    closeFolder,
    renameFolder,
    removeFromFolder,
    dragState,
    startDrag,
    updateDragPosition,
    setDropTarget,
    endDrag,
  } = useHomeScreen();

  const { getUnreadCountForApp, markAppNotificationsRead } = useSessionBrain();

  const isOpen = openFolderId === folder.id;
  const isDragging = dragState.isDragging && dragState.draggedIndex === index;
  const isDropTarget = dragState.dropTargetIndex === index && !isDragging;

  // Calculate total notification count for folder
  const folderNotificationCount = useMemo(() => {
    return folder.apps.reduce((count, app) => count + getUnreadCountForApp(app.id), 0);
  }, [folder.apps, getUnreadCountForApp]);

  // Mark notifications as read when opening an app
  const handleAppOpen = useCallback((appId: string) => {
    markAppNotificationsRead(appId);
  }, [markAppNotificationsRead]);

  // Motion values for drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const zIndex = useMotionValue(0);

  // Reset position when not dragging
  useEffect(() => {
    if (!isDragging) {
      animate(x, 0, springs.tight);
      animate(y, 0, springs.tight);
      animate(scale, 1, springs.tight);
      zIndex.set(0);
    }
  }, [isDragging, x, y, scale, zIndex]);

  // Long press handler
  const handleLongPressStart = useCallback(() => {
    longPressTimerRef.current = setTimeout(() => {
      if (!isDraggingRef.current && !isOpen) {
        enterEditMode();
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }
    }, LONG_PRESS_DURATION);
  }, [enterEditMode, isOpen]);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  // Handle folder open
  const handleFolderTap = useCallback(() => {
    if (isEditMode || isDraggingRef.current) return;
    openFolder(folder.id);
  }, [isEditMode, folder.id, openFolder]);

  // Handle rename
  const handleRenameSubmit = useCallback(() => {
    renameFolder(folder.id, folderName);
    setIsRenaming(false);
  }, [folder.id, folderName, renameFolder]);

  // Drag handlers
  const handleDragStart = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isEditMode || isOpen) return;

    isDraggingRef.current = true;
    handleLongPressEnd();

    zIndex.set(100);
    animate(scale, 1.1, springs.snappy);

    startDrag({ type: 'folder', item: folder }, index, { x: info.point.x, y: info.point.y });
  }, [isEditMode, isOpen, folder, index, startDrag, handleLongPressEnd, scale, zIndex]);

  const handleDrag = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isEditMode || !dragState.isDragging) return;

    updateDragPosition({ x: info.point.x, y: info.point.y });

    if (folderRef.current) {
      const gridContainer = folderRef.current.closest('.app-grid-container');
      if (gridContainer) {
        const icons = gridContainer.querySelectorAll('.app-icon-wrapper, .folder-wrapper');
        let closestIndex = -1;
        let closestDistance = Infinity;

        icons.forEach((icon, i) => {
          if (i === index) return;
          const rect = icon.getBoundingClientRect();
          const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          const distance = Math.hypot(info.point.x - center.x, info.point.y - center.y);

          if (distance < closestDistance && distance < 80) {
            closestDistance = distance;
            closestIndex = i;
          }
        });

        setDropTarget(closestIndex >= 0 ? closestIndex : null);
      }
    }
  }, [isEditMode, dragState.isDragging, index, updateDragPosition, setDropTarget]);

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    animate(scale, 1, springs.snappy);
    zIndex.set(0);
    endDrag();
  }, [endDrag, scale, zIndex]);

  // Preview icons (show up to 4 in a 2x2 grid)
  const previewApps = folder.apps.slice(0, 4);

  // Use CSS class for wiggle animation to avoid Framer Motion type issues
  const shouldWiggle = isEditMode && !isDragging && !isOpen;

  return (
    <>
      <motion.div
        ref={folderRef}
        className={`folder-wrapper flex flex-col items-center gap-2 relative ${
          shouldWiggle ? (index % 2 === 0 ? 'animate-ios-wiggle' : 'animate-ios-wiggle-alt') : ''
        }`}
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{
          opacity: dragState.isDragging && dragState.draggedIndex !== index && isDropTarget ? 0.5 : 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          delay,
          ...springs.snappy,
        }}
        style={{
          x: isDragging ? x : 0,
          y: isDragging ? y : 0,
          scale,
          zIndex,
        }}
        drag={isEditMode && !isOpen}
        dragMomentum={motionConfig.drag.momentum}
        dragElastic={motionConfig.drag.elastic}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onPointerDown={handleLongPressStart}
        onPointerUp={handleLongPressEnd}
        onPointerCancel={handleLongPressEnd}
        whileHover={!isEditMode && !isOpen ? { scale: 1.05 } : undefined}
        whileTap={!isEditMode && !isOpen ? { scale: 0.95 } : undefined}
      >
        {/* Delete button in edit mode */}
        {isEditMode && !isOpen && (
          <motion.button
            className="absolute -top-1 -left-1 z-20 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center border border-white/20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              // Could implement delete folder functionality
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-3 h-3 text-white" />
          </motion.button>
        )}

        {/* Notification badge for folder */}
        <AnimatePresence>
          {folderNotificationCount > 0 && !isEditMode && (
            <motion.div
              className="absolute -top-1 -right-1 z-20 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={springs.tight}
            >
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 bg-red-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
              <span className="relative text-[10px] font-bold text-white">
                {folderNotificationCount > 99 ? '99+' : folderNotificationCount}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drop target indicator */}
        {isDropTarget && (
          <motion.div
            className="absolute inset-0 rounded-[22px] border-2 border-white/50 bg-white/10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          />
        )}

        {/* Folder icon - shows 2x2 preview of apps */}
        <div
          onClick={handleFolderTap}
          className="block cursor-pointer"
        >
          <motion.div
            className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-[18px] sm:rounded-[20px] flex items-center justify-center shadow-lg relative overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20"
            animate={{
              boxShadow: isDragging
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                : isDropTarget
                  ? '0 0 20px rgba(255, 255, 255, 0.3)'
                  : '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* 2x2 Preview grid */}
            <div className="grid grid-cols-2 gap-1 p-2">
              {previewApps.map((app, i) => (
                <div
                  key={app.id}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-md overflow-hidden relative"
                  style={{ background: app.imageUrl ? 'transparent' : app.gradient }}
                >
                  {app.imageUrl ? (
                    <img
                      src={app.imageUrl}
                      alt={app.name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                      {app.icon && (
                        <div className="absolute inset-0 flex items-center justify-center text-white scale-[0.45]">
                          {app.icon}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({ length: 4 - previewApps.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-white/5"
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Folder name */}
        {isRenaming ? (
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
            className="text-white/90 text-xs font-medium text-center max-w-[72px] bg-transparent border border-white/30 rounded px-1 py-0.5 outline-none"
            autoFocus
          />
        ) : (
          <span
            className="text-white/90 text-xs font-medium text-center max-w-[72px] truncate select-none"
            onClick={(e) => {
              if (isEditMode) {
                e.stopPropagation();
                setIsRenaming(true);
              }
            }}
          >
            {folder.name}
          </span>
        )}
      </motion.div>

      {/* Expanded folder overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={springs.smooth}
            onClick={closeFolder}
          >
            {/* Backdrop blur */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={springs.smooth}
            />

            {/* Folder content */}
            <motion.div
              className="relative z-10 w-[90%] max-w-md"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={springs.snappy}
              onClick={(e) => e.stopPropagation()}
            >
              <LiquidGlass
                variant="panel"
                intensity="medium"
                className="!p-6"
                rippleEffect={false}
              >
                {/* Folder header */}
                <div className="flex items-center justify-between mb-6">
                  {isRenaming ? (
                    <input
                      type="text"
                      value={folderName}
                      onChange={(e) => setFolderName(e.target.value)}
                      onBlur={handleRenameSubmit}
                      onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                      className="text-white text-lg font-semibold bg-transparent border-b border-white/30 outline-none"
                      autoFocus
                    />
                  ) : (
                    <h2
                      className="text-white text-lg font-semibold flex items-center gap-2 cursor-pointer group"
                      onClick={() => setIsRenaming(true)}
                    >
                      {folder.name}
                      <Pencil className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                    </h2>
                  )}
                  <button
                    onClick={closeFolder}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Apps grid inside folder */}
                <div className="grid grid-cols-4 gap-4">
                  {folder.apps.map((app, i) => (
                    <FolderAppIcon
                      key={app.id}
                      app={app}
                      folderId={folder.id}
                      index={i}
                      notificationCount={getUnreadCountForApp(app.id)}
                      onAppOpen={handleAppOpen}
                    />
                  ))}
                </div>
              </LiquidGlass>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Simplified app icon inside folder
interface FolderAppIconProps {
  app: AppItem;
  folderId: string;
  index: number;
  notificationCount?: number;
  onAppOpen?: (appId: string) => void;
}

function FolderAppIcon({ app, folderId, index, notificationCount = 0, onAppOpen }: FolderAppIconProps) {
  const { isEditMode, removeFromFolder, closeFolder } = useHomeScreen();
  const router = useRouter();

  const handleTap = useCallback(() => {
    if (isEditMode) return;

    // Mark notifications as read
    if (onAppOpen) {
      onAppOpen(app.id);
    }

    if (app.external && app.href) {
      window.open(app.href, '_blank', 'noopener,noreferrer');
      return;
    }

    if (app.href && !app.isChat) {
      closeFolder();
      router.push(app.href);
    }
  }, [app, router, isEditMode, closeFolder, onAppOpen]);

  return (
    <motion.div
      className="flex flex-col items-center gap-1 relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Remove button in edit mode */}
      {isEditMode && (
        <motion.button
          className="absolute -top-1 -left-1 z-20 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center border border-white/20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            removeFromFolder(folderId, app.id);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-2.5 h-2.5 text-white" />
        </motion.button>
      )}

      {/* Notification badge */}
      <AnimatePresence>
        {notificationCount > 0 && !isEditMode && (
          <motion.div
            className="absolute -top-1 -right-1 z-20 min-w-[16px] h-[16px] px-0.5 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={springs.tight}
          >
            <span className="text-[9px] font-bold text-white">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        onClick={handleTap}
        className="cursor-pointer"
      >
        <div
          className="w-14 h-14 rounded-[14px] flex items-center justify-center shadow-lg relative overflow-hidden"
          style={{ background: app.imageUrl ? 'transparent' : app.gradient }}
        >
          {app.imageUrl ? (
            <img
              src={app.imageUrl}
              alt={app.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              <div className="relative z-10 text-white scale-90">
                {app.icon}
              </div>
            </>
          )}
        </div>
      </div>
      <span className="text-white/90 text-[10px] font-medium text-center max-w-[56px] truncate select-none">
        {app.name}
      </span>
    </motion.div>
  );
}
