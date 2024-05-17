export var ScreenMarginScalar = 0.08;
export var BoxMarginScalar = 0.03;

export var ScreenSize;
export var ScreenMargin;
export var BoxMargin;
export var Linewidth = 10;

export function updateVariables(canvas) {
    ScreenSize = canvas.width;
	ScreenMargin = ScreenSize * ScreenMarginScalar;
	BoxMargin = ScreenSize * BoxMarginScalar;
}
