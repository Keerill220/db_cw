using System.ComponentModel.DataAnnotations;

namespace StudioBooking.Api.DTOs.Bookings;

public record BookingDto(
    int BookingId,
    int ClientId,
    string ClientName,
    int RoomId,
    string RoomName,
    string StudioName,
    DateOnly Date,
    TimeOnly StartTime,
    TimeOnly EndTime,
    decimal TotalPrice,
    string Status,
    DateTime CreatedAt,
    string? Note);

public record BookingCreateDto(
    [Required] int RoomId,
    [Required] DateOnly Date,
    [Required] TimeOnly StartTime,
    [Required] TimeOnly EndTime,
    string? Note,
    IEnumerable<int>? EquipmentIds);

public record BookingStatusPatchDto([Required] string Status);
