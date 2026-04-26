using StudioBooking.Api.Models.Entities;

namespace StudioBooking.Api.Repositories.Interfaces;

public interface IBookingRepository
{
    Task<Booking?> FindByIdAsync(int id, CancellationToken ct = default);
    Task<Booking?> FindByIdWithDetailsAsync(int id, CancellationToken ct = default);

    Task<(IEnumerable<Booking> Items, int Total)> GetPagedAsync(
        int page, int pageSize,
        int? clientId = null, int? roomId = null, int? studioId = null,
        DateOnly? from = null, DateOnly? to = null,
        string? status = null, CancellationToken ct = default);

    Task<Booking> CreateAsync(Booking booking, CancellationToken ct = default);
    Task UpdateAsync(Booking booking, CancellationToken ct = default);
    Task AddEquipmentAsync(BookingEquipment be, CancellationToken ct = default);
}
