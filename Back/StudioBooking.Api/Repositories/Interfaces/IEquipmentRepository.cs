using StudioBooking.Api.Models.Entities;

namespace StudioBooking.Api.Repositories.Interfaces;

public interface IEquipmentRepository
{
    Task<Equipment?> FindByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<Equipment>> GetByRoomAsync(int roomId, CancellationToken ct = default);
    Task<Equipment> CreateAsync(Equipment equipment, CancellationToken ct = default);
    Task UpdateAsync(Equipment equipment, CancellationToken ct = default);
    Task DeleteAsync(Equipment equipment, CancellationToken ct = default);
}
