import { degreeToRadian } from './number';
import { generateCharacter } from './string';

/** element.style px을 number로 변환하는 함수 */
export const pxToNumber = (px: string) => px.split(' ').map((s) => Number(s.replace('px', ''))) ?? [];

/** 도형의 path data를 return하는 함수 */
export const getPathOf = {
    rect: ({ width, height, padding = 0.5 }: TGetPathOf) => {
        const tl = { x: padding, y: padding };
        const bl = { x: padding, y: height - padding };
        const br = { x: width - padding, y: height - padding };
        const tr = { x: width - padding, y: padding };

        return `M${tl.x},${tl.y} L${bl.x},${bl.y} L${br.x},${br.y} L${tr.x},${tr.y}z`;
    },
    // curve: ({ width, height, padding }: TGetPathOf) => {
    //     const start = { x: padding, y: height - padding };
    //     const mid = { x: width / 2, y: -height + padding * 3 };
    //     const end = { x: width - padding, y: height - padding };

    //     return `M${start.x}, ${start.y} Q${mid.x}, ${mid.y}, ${end.x}, ${end.y}`;
    // },
    // angle: ({ width, height, padding }: TGetPathOf) => {
    //     const start = { x: width - padding, y: padding };
    //     const mid = { x: padding, y: height - padding - 2 };
    //     const end = { x: width - padding, y: height - padding - 2 };

    //     return `M${start.x},${start.y} L${mid.x},${mid.y} L${end.x},${end.y}`;
    // },
    // acuteTriangle: ({ width, height, padding, meditation }: TGetPathOf & { meditation: number }) => {
    //     const tc = { x: meditation, y: padding };
    //     const bl = { x: padding, y: height - padding };
    //     const br = { x: width - padding, y: height - padding };
    //     return `M${tc.x}, ${tc.y} L${bl.x}, ${bl.y} L${br.x}, ${br.y}z`;
    // },
    // obtuseTriangle: ({ width, height, padding, meditation }: TGetPathOf & { meditation: number }) => {
    //     const tc = { x: width - padding, y: padding };
    //     const bl = { x: padding, y: height - padding };
    //     const br = { x: meditation, y: height - padding };

    //     return `M${tc.x}, ${tc.y} L${bl.x}, ${bl.y} L${br.x}, ${br.y}z`;
    // },
    // rhombus: ({ width, height, padding }: TGetPathOf) => {
    //     const tc = { x: width / 2, y: padding };
    //     const lc = { x: padding * 2, y: height / 2 };
    //     const bc = { x: width / 2, y: height - padding };
    //     const rc = { x: width - padding * 2, y: height / 2 };

    //     return `M${tc.x}, ${tc.y} L${lc.x}, ${lc.y} L${bc.x}, ${bc.y} L${rc.x}, ${rc.y}z`;
    // },
    parallelogram: ({ width, height, padding = 0.5, meditation }: TGetPathOf & { meditation: number }) => {
        const tl = { x: meditation + padding, y: padding };
        const bl = { x: padding, y: height - padding };
        const br = { x: width - meditation - padding, y: height - padding };
        const tr = { x: width - padding, y: padding };

        return `M${tl.x}, ${tl.y} L${bl.x}, ${bl.y} L${br.x}, ${br.y} L${tr.x}, ${tr.y}z`;
    }
    // trapezoid: ({
    //     width,
    //     height,
    //     padding,
    //     meditation,
    //     subMeditation
    // }: TGetPathOf & { meditation: number; subMeditation: number }) => {
    //     const tl = { x: meditation + padding, y: padding };
    //     const bl = { x: padding, y: height - padding };
    //     const br = { x: width - padding, y: height - padding };
    //     const tr = { x: subMeditation - padding, y: padding };

    //     return `M${tl.x}, ${tl.y} L${bl.x}, ${bl.y} L${br.x}, ${br.y} L${tr.x}, ${tr.y}z`;
    // }
};

/** id 생성*/
export const createId = () => generateCharacter();

/**
 * 회전된 좌표의 포인트를 구하는 함수
 * @param {Object} options
 * @param options.point 회전 시키려는 좌표
 * @param options.origin 회전의 중점 좌표
 * @param options.degree 회전시키려는 각도
 */
export const rotatePoint = (options: { point: { x: number; y: number }; origin: { x: number; y: number }; degree: number }) => {
    const { point, origin, degree } = options;

    const vector = { x: point.x - origin.x, y: point.y - origin.y };
    const scale = { x: 1, y: 1 };
    const translate = { x: origin.x, y: origin.y };
    const radian = degreeToRadian(degree);

    const domPoint = new DOMPoint(vector.x, vector.y);

    const matrix = new DOMMatrix([
        Math.cos(radian) * scale.x,
        Math.sin(radian) * scale.x,
        -Math.sin(radian) * scale.y,
        Math.cos(radian) * scale.y,
        translate.x,
        translate.y
    ]);

    return domPoint.matrixTransform(matrix);
};
