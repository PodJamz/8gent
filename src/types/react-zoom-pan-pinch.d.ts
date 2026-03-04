declare module 'react-zoom-pan-pinch' {
  import { ReactNode, RefObject, ForwardRefExoticComponent, RefAttributes } from 'react';

  export interface ReactZoomPanPinchState {
    scale: number;
    positionX: number;
    positionY: number;
    previousScale: number;
  }

  export interface ReactZoomPanPinchRef {
    state: ReactZoomPanPinchState;
    zoomIn: (step?: number) => void;
    zoomOut: (step?: number) => void;
    centerView: (scale?: number, animationTime?: number, animationType?: string) => void;
    resetTransform: (animationTime?: number, animationType?: string) => void;
    setTransform: (positionX: number, positionY: number, scale: number, animationTime?: number, animationType?: string) => void;
  }

  export interface TransformWrapperProps {
    children?: ReactNode | ((ref: ReactZoomPanPinchRef) => ReactNode);
    initialScale?: number;
    initialPositionX?: number;
    initialPositionY?: number;
    minScale?: number;
    maxScale?: number;
    limitToBounds?: boolean;
    disabled?: boolean;
    centerZoomedOut?: boolean;
    centerOnInit?: boolean;
    wheel?: {
      step?: number;
      disabled?: boolean;
      wheelDisabled?: boolean;
      touchPadDisabled?: boolean;
      activationKeys?: string[];
      excluded?: string[];
    };
    panning?: {
      disabled?: boolean;
      velocityDisabled?: boolean;
      lockAxisX?: boolean;
      lockAxisY?: boolean;
      activationKeys?: string[];
      excluded?: string[];
    };
    pinch?: {
      disabled?: boolean;
      step?: number;
    };
    doubleClick?: {
      disabled?: boolean;
      step?: number;
      mode?: 'zoomIn' | 'zoomOut' | 'reset';
      animationTime?: number;
      animationType?: string;
      excluded?: string[];
    };
    onInit?: (ref: ReactZoomPanPinchRef) => void;
    onPanning?: (ref: ReactZoomPanPinchRef, event: MouseEvent | TouchEvent) => void;
    onPanningStart?: (ref: ReactZoomPanPinchRef, event: MouseEvent | TouchEvent) => void;
    onPanningStop?: (ref: ReactZoomPanPinchRef, event: MouseEvent | TouchEvent) => void;
    onZoom?: (ref: ReactZoomPanPinchRef, event: WheelEvent | TouchEvent) => void;
    onZoomStart?: (ref: ReactZoomPanPinchRef, event: WheelEvent | TouchEvent) => void;
    onZoomStop?: (ref: ReactZoomPanPinchRef, event: WheelEvent | TouchEvent) => void;
    onTransformed?: (ref: ReactZoomPanPinchRef, state: { scale: number; positionX: number; positionY: number }) => void;
  }

  export interface TransformComponentProps {
    children: ReactNode;
    wrapperClass?: string;
    contentClass?: string;
    wrapperStyle?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
  }

  export const TransformWrapper: ForwardRefExoticComponent<TransformWrapperProps & RefAttributes<ReactZoomPanPinchRef>>;
  export const TransformComponent: React.FC<TransformComponentProps>;
  export function useControls(): ReactZoomPanPinchRef;
}
