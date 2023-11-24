import fc from 'fast-check'
import { areVectorsEqual, arePointsEqual, serializePoint, serializeVector } from '@/omnigraph/coordinates'
import { pointArbitrary, addressArbitrary, endpointArbitrary, vectorArbitrary } from '../__utils__/arbitraries'

describe('omnigraph/vector', () => {
    describe('assertions', () => {
        describe('arePointsEqual', () => {
            it('should be true for referentially equal vector', () => {
                fc.assert(
                    fc.property(pointArbitrary, (point) => {
                        expect(arePointsEqual(point, point)).toBeTruthy()
                    })
                )
            })

            it('should be true for value equal vector', () => {
                fc.assert(
                    fc.property(pointArbitrary, (point) => {
                        expect(arePointsEqual(point, { ...point })).toBeTruthy()
                    })
                )
            })

            it("should be false when addresses don't match", () => {
                fc.assert(
                    fc.property(pointArbitrary, addressArbitrary, (point, address) => {
                        fc.pre(point.address !== address)

                        expect(arePointsEqual(point, { ...point, address })).toBeFalsy()
                    })
                )
            })

            it("should be false when endpoint IDs don't match", () => {
                fc.assert(
                    fc.property(pointArbitrary, endpointArbitrary, (point, eid) => {
                        fc.pre(point.eid !== eid)

                        expect(arePointsEqual(point, { ...point, eid })).toBeFalsy()
                    })
                )
            })
        })

        describe('areVectorsEqual', () => {
            it('should be true for referentially equal vector', () => {
                fc.assert(
                    fc.property(vectorArbitrary, (vector) => {
                        expect(areVectorsEqual(vector, vector)).toBeTruthy()
                    })
                )
            })

            it('should be true for value equal vector', () => {
                fc.assert(
                    fc.property(vectorArbitrary, (vector) => {
                        expect(areVectorsEqual(vector, { ...vector })).toBeTruthy()
                    })
                )
            })

            it("should be false when from point doesn't match", () => {
                fc.assert(
                    fc.property(vectorArbitrary, pointArbitrary, (vector, from) => {
                        fc.pre(!arePointsEqual(vector.from, from))

                        expect(areVectorsEqual(vector, { ...vector, from })).toBeFalsy()
                    })
                )
            })

            it("should be false when to point doesn't match", () => {
                fc.assert(
                    fc.property(vectorArbitrary, pointArbitrary, (vector, to) => {
                        fc.pre(!arePointsEqual(vector.from, to))

                        expect(areVectorsEqual(vector, { ...vector, to })).toBeFalsy()
                    })
                )
            })
        })
    })

    describe('serialization', () => {
        describe('serializePoint', () => {
            it('should produce identical serialized values if the vector match', () => {
                fc.assert(
                    fc.property(pointArbitrary, (point) => {
                        expect(serializePoint(point)).toBe(serializePoint({ ...point }))
                    })
                )
            })

            it("should produce different serialized values if the vector don't match", () => {
                fc.assert(
                    fc.property(pointArbitrary, pointArbitrary, (pointA, pointB) => {
                        fc.pre(!arePointsEqual(pointA, pointB))

                        expect(serializePoint(pointA)).not.toBe(serializePoint(pointB))
                    })
                )
            })
        })

        describe('serializeVector', () => {
            it('should produce identical serialized values if the vector match', () => {
                fc.assert(
                    fc.property(vectorArbitrary, (vector) => {
                        expect(serializeVector(vector)).toBe(serializeVector({ ...vector }))
                    })
                )
            })

            it("should produce different serialized values if the vector don't match", () => {
                fc.assert(
                    fc.property(vectorArbitrary, vectorArbitrary, (lineA, lineB) => {
                        fc.pre(!areVectorsEqual(lineA, lineB))

                        expect(serializeVector(lineA)).not.toBe(serializeVector(lineB))
                    })
                )
            })
        })
    })
})
