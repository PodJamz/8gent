/**
 * SuperDesign Component Library
 * A comprehensive, production-ready design system with 50+ components
 *
 * Categories:
 * - Layout: Container, Stack, Grid, Flex, Section, Box, AspectRatio, Center, Spacer, Divider
 * - Typography: Heading, Text, Paragraph, Code, Blockquote, List, Label, Highlight
 * - Form: Input, Textarea, Select, Checkbox, Radio, Switch, Slider, FormField, FormGroup
 * - Feedback: Alert, Toast, Progress, Spinner, Skeleton, EmptyState, Banner
 * - Data Display: DataTable, Stat, Timeline, Calendar, Tag, Chip, KeyValue
 * - Navigation: Breadcrumb, Tabs, Pagination, Menu, NavLink, Stepper
 * - Overlay: Modal, Drawer, Popover, Dialog, Sheet, Dropdown
 * - Media: Image, Video, Carousel, Gallery
 * - Interactive: Accordion, Collapsible, DragHandle, Resizable
 */

// Layout Components (10)
export {
  Container,
  containerVariants,
  type ContainerProps,
} from './layout/Container';

export {
  Stack,
  HStack,
  VStack,
  stackVariants,
  type StackProps,
} from './layout/Stack';

export {
  Grid,
  GridItem,
  gridVariants,
  type GridProps,
  type GridItemProps,
} from './layout/Grid';

export {
  Flex,
  flexVariants,
  type FlexProps,
} from './layout/Flex';

export {
  Section,
  sectionVariants,
  type SectionProps,
} from './layout/Section';

export {
  Box,
  type BoxProps,
} from './layout/Box';

export {
  AspectRatio,
  type AspectRatioProps,
} from './layout/AspectRatio';

export {
  Center,
  type CenterProps,
} from './layout/Center';

export {
  Spacer,
  spacerVariants,
  type SpacerProps,
} from './layout/Spacer';

export {
  Divider,
  dividerVariants,
  type DividerProps,
} from './layout/Divider';

// Typography Components (8)
export {
  Heading,
  headingVariants,
  type HeadingProps,
} from './typography/Heading';

export {
  Text,
  textVariants,
  type TextProps,
} from './typography/Text';

export {
  Paragraph,
  paragraphVariants,
  type ParagraphProps,
} from './typography/Paragraph';

export {
  Code,
  codeVariants,
  type CodeProps,
} from './typography/Code';

export {
  Blockquote,
  blockquoteVariants,
  type BlockquoteProps,
} from './typography/Blockquote';

export {
  List,
  ListItem,
  listVariants,
  type ListProps,
  type ListItemProps,
} from './typography/List';

export {
  Label,
  labelVariants,
  type LabelProps,
} from './typography/Label';

export {
  Highlight,
  highlightVariants,
  type HighlightProps,
} from './typography/Highlight';

// Form Components (9)
export {
  Input,
  inputVariants,
  type InputProps,
} from './form/Input';

export {
  Textarea,
  textareaVariants,
  type TextareaProps,
} from './form/Textarea';

export {
  Select,
  selectVariants,
  type SelectProps,
  type SelectOption,
} from './form/Select';

export {
  Checkbox,
  checkboxVariants,
  type CheckboxProps,
} from './form/Checkbox';

export {
  Radio,
  RadioGroup,
  radioVariants,
  type RadioProps,
  type RadioGroupProps,
} from './form/Radio';

export {
  Switch,
  switchVariants,
  type SwitchProps,
} from './form/Switch';

export {
  Slider,
  sliderVariants,
  type SliderProps,
} from './form/Slider';

export {
  FormField,
  type FormFieldProps,
} from './form/FormField';

export {
  FormGroup,
  formGroupVariants,
  type FormGroupProps,
} from './form/FormGroup';

// Feedback Components (7)
export {
  Alert,
  alertVariants,
  type AlertProps,
} from './feedback/Alert';

export {
  Toast,
  ToastContainer,
  toastVariants,
  type ToastProps,
  type ToastContainerProps,
} from './feedback/Toast';

export {
  Progress,
  progressVariants,
  type ProgressProps,
} from './feedback/Progress';

export {
  Spinner,
  spinnerVariants,
  type SpinnerProps,
} from './feedback/Spinner';

export {
  Skeleton,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonText,
  skeletonVariants,
  type SkeletonProps,
} from './feedback/Skeleton';

export {
  EmptyState,
  emptyStateVariants,
  type EmptyStateProps,
} from './feedback/EmptyState';

export {
  Banner,
  bannerVariants,
  type BannerProps,
} from './feedback/Banner';

// Data Display Components (7)
export {
  DataTable,
  tableVariants,
  type DataTableProps,
  type Column,
} from './data-display/DataTable';

export {
  Stat,
  StatGroup,
  statVariants,
  type StatProps,
  type StatGroupProps,
} from './data-display/Stat';

export {
  Timeline,
  TimelineItem,
  timelineVariants,
  type TimelineProps,
  type TimelineItemProps,
} from './data-display/Timeline';

export {
  Calendar,
  calendarVariants,
  type CalendarProps,
} from './data-display/Calendar';

export {
  Tag,
  tagVariants,
  type TagProps,
} from './data-display/Tag';

export {
  Chip,
  ChipGroup,
  chipVariants,
  type ChipProps,
  type ChipGroupProps,
} from './data-display/Chip';

export {
  KeyValue,
  KeyValueList,
  keyValueVariants,
  type KeyValueProps,
  type KeyValueListProps,
} from './data-display/KeyValue';

// Navigation Components (6)
export {
  Breadcrumb,
  breadcrumbVariants,
  type BreadcrumbProps,
  type BreadcrumbItem,
} from './navigation/Breadcrumb';

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
  tabTriggerVariants,
  type TabsProps,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentProps,
} from './navigation/Tabs';

export {
  Pagination,
  paginationItemVariants,
  type PaginationProps,
} from './navigation/Pagination';

export {
  Menu,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuSub,
  menuVariants,
  menuItemVariants,
  type MenuProps,
  type MenuItemProps,
  type MenuLabelProps,
  type MenuSubProps,
} from './navigation/Menu';

export {
  NavLink,
  NavGroup,
  navLinkVariants,
  type NavLinkProps,
  type NavGroupProps,
} from './navigation/NavLink';

export {
  Stepper,
  stepperVariants,
  stepVariants,
  type StepperProps,
  type Step,
} from './navigation/Stepper';

// Overlay Components (6)
export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  modalContentVariants,
  type ModalProps,
} from './overlay/Modal';

export {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
  drawerVariants,
  type DrawerProps,
} from './overlay/Drawer';

export {
  Popover,
  popoverVariants,
  type PopoverProps,
} from './overlay/Popover';

export {
  Dialog,
  dialogVariants,
  type DialogProps,
} from './overlay/Dialog';

export {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetBody,
  sheetVariants,
  type SheetProps,
} from './overlay/Sheet';

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  dropdownContentVariants,
  dropdownItemVariants,
  type DropdownProps,
  type DropdownTriggerProps,
  type DropdownContentProps,
  type DropdownItemProps,
} from './overlay/Dropdown';

// Media Components (4)
export {
  Image,
  imageVariants,
  type ImageProps,
} from './media/Image';

export {
  Video,
  videoVariants,
  type VideoProps,
} from './media/Video';

export {
  Carousel,
  carouselVariants,
  type CarouselProps,
} from './media/Carousel';

export {
  Gallery,
  galleryVariants,
  type GalleryProps,
  type GalleryImage,
} from './media/Gallery';

// Interactive Components (4)
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionVariants,
  type AccordionProps,
  type AccordionItemProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
} from './interactive/Accordion';

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  type CollapsibleProps,
  type CollapsibleTriggerProps,
  type CollapsibleContentProps,
} from './interactive/Collapsible';

export {
  DragHandle,
  dragHandleVariants,
  type DragHandleProps,
} from './interactive/DragHandle';

export {
  Resizable,
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  type ResizableProps,
  type ResizablePanelGroupProps,
  type ResizablePanelProps,
  type ResizableHandleProps,
} from './interactive/Resizable';
