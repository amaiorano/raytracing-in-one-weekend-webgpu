export class RNG {
    rng: any;

    seed(s: number) {
        this.rng = this.mulberry32(s);
    }

    rand() {
        return this.rng();
    }

    private mulberry32(a: number) {
        return function () {
            var t = a += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }
}
