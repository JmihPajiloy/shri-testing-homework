import { describe } from 'vitest';
import { useCsvAnalysis } from '@hooks/use-csv-analysis.ts';

const configStub = {
    onError: vi.fn(),
    onData: vi.fn(),
    onComplete: vi.fn()
}

const fetchMock = vi.spyOn(fetch)
describe("useCsvAnalysis", () => {
    it("Делает запрос по нужному адресу", async () => {
        useCsvAnalysis()
    })
})