import { standupService } from "../services/api";
import axios from "axios";
import { vi, describe, it, expect } from "vitest";

vi.mock("axios", async () => {
  const mockGet = vi.fn();
  const mockPost = vi.fn();
  const actualAxios = await vi.importActual("axios");

  return {
    default: {
      ...actualAxios,
      create: vi.fn(() => ({
        get: mockGet,
        post: mockPost,
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }, 
        },
      })),
      __mockGet: mockGet,
      __mockPost: mockPost,
    },
  };
});



const mockedAxios = axios as any;

describe("standupService", () => {
  it("fetches my standups", async () => {
    mockedAxios.__mockGet.mockResolvedValueOnce({ data: [{ date: "2025-04-29" }] });
    const result = await standupService.getMine();
    expect(result.data[0].date).toBe("2025-04-29");
    expect(mockedAxios.__mockGet).toHaveBeenCalledWith("/standups/mine", { params: undefined });
  });

  it("creates a standup", async () => {
    mockedAxios.__mockPost.mockResolvedValueOnce({ data: { success: true } });
    const data = { date: "2025-04-29", yesterday: "A", today: "B" };
    const result = await standupService.create(data);
    expect(result.data.success).toBe(true);
    expect(mockedAxios.__mockPost).toHaveBeenCalledWith("/standups", data);
  });
});