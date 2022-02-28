import Song from '../../models/song';
import SongService from '../song.service'

jest.mock("../song.service");

const mockSongReturn: Song =  {
    songid: 1,
    songname: "Test Song",
    artist: "Test Artist",
    writer: "Test Writer",
    album: "Test Album",
    releaseyear: 1990
}


it("should mock result of async function getSongById of SongService class", async () => {
  const MockSongServiceClass = SongService as jest.Mocked<typeof SongService>;

  jest.spyOn(MockSongServiceClass, "getSongById").mockImplementation(async (songId: number) => mockSongReturn);

  const response = await MockSongServiceClass.getSongById(1);
  expect(response).toStrictEqual(mockSongReturn);
});
