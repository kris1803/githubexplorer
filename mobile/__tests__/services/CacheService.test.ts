import { CacheService, CustomStorage } from "../../src/services/CacheService";

describe("CacheService", () => {
  let service: CacheService;
  let storage: CustomStorage;

  beforeEach(() => {
    storage = {
      getItem: jest.fn().mockResolvedValue("getItem"),
      clear: jest.fn(),
      removeItem: jest.fn(),
      setItem: jest.fn(),
    };
    service = new CacheService(storage);
  });

  it(".setItem()", () => {
    service.setItem("testkey", "testvalue");
    const params = (storage.setItem as jest.Mock).mock.calls[0];
    expect(params[0]).toBe("testkey");
    expect(params[1]).toBe("testvalue");
  });

  it(".getItem()", async () => {
    const found = await service.getItem("testkey");
    const params = (storage.getItem as jest.Mock).mock.calls[0];
    expect(params[0]).toBe("testkey");
    expect(found).toBe("getItem");
  });

  it(".removeItem()", async () => {
    const found = await service.removeItem("testkey3");
    const params = (storage.removeItem as jest.Mock).mock.calls[0];
    expect(params[0]).toBe("testkey3");
  });
});
