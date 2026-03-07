import {Vec3Like} from "gl-matrix";
import {expect} from "vitest";

export function compareVec3(expected: Vec3Like, actual: Vec3Like, digits: number): void {
    expect(Array.from(actual)).toEqual([
        expect.closeTo(expected[0], digits),
        expect.closeTo(expected[1], digits),
        expect.closeTo(expected[2], digits)
    ]);
}