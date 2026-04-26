using StudioBooking.Api.Models.Entities;

namespace StudioBooking.Api.Repositories.Interfaces;

public interface IRoomRepository
{
    Task<Room?> FindByIdAsync(int id, CancellationToken ct = default);
    Task<Room?> FindByIdWithDetailsAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<Room>> GetByStudioAsync(int studioId, CancellationToken ct = default);
    Task<Room> CreateAsync(Room room, CancellationToken ct = default);
    Task UpdateAsync(Room room, CancellationToken ct = default);
    Task DeleteAsync(Room room, CancellationToken ct = default);
    Task<IEnumerable<Booking>> GetBusySlotsAsync(int roomId, DateOnly date, CancellationToken ct = default);
}
