using StudioBooking.Api.Auth;
using StudioBooking.Api.Common.Exceptions;
using StudioBooking.Api.DTOs.Equipment;
using StudioBooking.Api.Models.Entities;
using StudioBooking.Api.Repositories.Interfaces;

namespace StudioBooking.Api.Services;

public interface IEquipmentService
{
    Task<EquipmentDto> GetByIdAsync(int id, CancellationToken ct);
    Task<EquipmentDto> CreateAsync(EquipmentCreateDto dto, CancellationToken ct);
    Task<EquipmentDto> UpdateAsync(int id, EquipmentUpdateDto dto, CancellationToken ct);
    Task DeleteAsync(int id, CancellationToken ct);
}

public class EquipmentService : IEquipmentService
{
    private readonly IEquipmentRepository _equipment;
    private readonly IRoomRepository _rooms;
    private readonly ICurrentUser _currentUser;

    public EquipmentService(IEquipmentRepository equipment, IRoomRepository rooms, ICurrentUser currentUser)
    {
        _equipment = equipment; _rooms = rooms; _currentUser = currentUser;
    }

    public async Task<EquipmentDto> GetByIdAsync(int id, CancellationToken ct)
    {
        var e = await _equipment.FindByIdAsync(id, ct)
            ?? throw new NotFoundException($"Equipment {id} not found.");
        return ToDto(e);
    }

    public async Task<EquipmentDto> CreateAsync(EquipmentCreateDto dto, CancellationToken ct)
    {
        var room = await _rooms.FindByIdAsync(dto.RoomId, ct)
            ?? throw new NotFoundException($"Room {dto.RoomId} not found.");
        EnsureOwnership(room);
        var entity = new Equipment
        {
            RoomId = dto.RoomId, TypeId = dto.TypeId, Name = dto.Name,
            Condition = dto.Condition, PricePerHour = dto.PricePerHour,
        };
        await _equipment.CreateAsync(entity, ct);
        var created = await _equipment.FindByIdAsync(entity.EquipmentId, ct)!;
        return ToDto(created!);
    }

    public async Task<EquipmentDto> UpdateAsync(int id, EquipmentUpdateDto dto, CancellationToken ct)
    {
        var entity = await _equipment.FindByIdAsync(id, ct)
            ?? throw new NotFoundException($"Equipment {id} not found.");
        EnsureOwnership(entity.Room);
        entity.TypeId = dto.TypeId; entity.Name = dto.Name;
        entity.Condition = dto.Condition; entity.PricePerHour = dto.PricePerHour;
        await _equipment.UpdateAsync(entity, ct);
        return ToDto(entity);
    }

    public async Task DeleteAsync(int id, CancellationToken ct)
    {
        var entity = await _equipment.FindByIdAsync(id, ct)
            ?? throw new NotFoundException($"Equipment {id} not found.");
        EnsureOwnership(entity.Room);
        await _equipment.DeleteAsync(entity, ct);
    }

    private void EnsureOwnership(Room room)
    {
        if (_currentUser.Role == Roles.Superadmin) return;
        if (room.Studio.AdminId != _currentUser.UserId) throw new ForbiddenException();
    }

    private static EquipmentDto ToDto(Equipment e) => new(
        e.EquipmentId, e.RoomId, e.Room?.Name ?? "", e.TypeId,
        e.EquipmentType?.Name ?? "", e.Name, e.Condition, e.PricePerHour);
}
