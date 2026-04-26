using Microsoft.EntityFrameworkCore;
using StudioBooking.Api.Auth;
using StudioBooking.Api.Data;
using StudioBooking.Api.DTOs.Common;

namespace StudioBooking.Api.Services;

public interface IReportService
{
    Task<IEnumerable<OccupancyReportItemDto>> GetOccupancyAsync(CancellationToken ct);
    Task<IEnumerable<RevenueReportItemDto>> GetRevenueAsync(CancellationToken ct);
    Task<IEnumerable<TopRoomDto>> GetTopRoomsAsync(CancellationToken ct);
}

public class ReportService : IReportService
{
    private readonly ApplicationDbContext _db;
    private readonly ICurrentUser _currentUser;

    public ReportService(ApplicationDbContext db, ICurrentUser currentUser)
    {
        _db = db; _currentUser = currentUser;
    }

    public async Task<IEnumerable<OccupancyReportItemDto>> GetOccupancyAsync(CancellationToken ct)
    {
        var cutoff = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-7));
        var ownerId = _currentUser.Role == Roles.Owner ? _currentUser.UserId : (int?)null;

        var rows = await _db.Bookings
            .Where(b => b.Date >= cutoff &&
                        (b.Status == Models.Entities.BookingStatus.Confirmed ||
                         b.Status == Models.Entities.BookingStatus.Completed))
            .Where(b => ownerId == null || b.Room.Studio.AdminId == ownerId)
            .Select(b => new
            {
                b.Room.StudioId,
                StudioName = b.Room.Studio.Name,
                b.Date,
                b.StartTime,
                b.EndTime,
            })
            .ToListAsync(ct);

        return rows
            .GroupBy(x => new { x.StudioId, x.StudioName, x.Date.Year, x.Date.Month })
            .Select(g => new OccupancyReportItemDto(
                g.Key.StudioId,
                g.Key.StudioName,
                g.Key.Month,
                g.Key.Year,
                g.Count(),
                (int)Math.Round(g.Sum(x => (x.EndTime - x.StartTime).TotalHours))))
            .OrderBy(x => x.StudioId).ThenBy(x => x.Year).ThenBy(x => x.Month)
            .ToList();
    }

    public async Task<IEnumerable<RevenueReportItemDto>> GetRevenueAsync(CancellationToken ct)
    {
        var cutoff = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-7));
        var ownerId = _currentUser.Role == Roles.Owner ? _currentUser.UserId : (int?)null;

        var rows = await _db.Bookings
            .Where(b => b.Date >= cutoff &&
                        (b.Status == Models.Entities.BookingStatus.Confirmed ||
                         b.Status == Models.Entities.BookingStatus.Completed))
            .Where(b => ownerId == null || b.Room.Studio.AdminId == ownerId)
            .Select(b => new
            {
                b.Room.StudioId,
                StudioName = b.Room.Studio.Name,
                b.Date,
                b.TotalPrice,
            })
            .ToListAsync(ct);

        return rows
            .GroupBy(x => new { x.StudioId, x.StudioName, x.Date.Year, x.Date.Month })
            .Select(g => new RevenueReportItemDto(
                g.Key.StudioId,
                g.Key.StudioName,
                g.Key.Month,
                g.Key.Year,
                g.Sum(x => x.TotalPrice)))
            .OrderBy(x => x.StudioId).ThenBy(x => x.Year).ThenBy(x => x.Month)
            .ToList();
    }

    public async Task<IEnumerable<TopRoomDto>> GetTopRoomsAsync(CancellationToken ct)
    {
        var cutoff = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-7));
        var ownerId = _currentUser.Role == Roles.Owner ? _currentUser.UserId : (int?)null;

        var rows = await _db.Bookings
            .Where(b => b.Date >= cutoff && b.Status != Models.Entities.BookingStatus.Cancelled)
            .Where(b => ownerId == null || b.Room.Studio.AdminId == ownerId)
            .Select(b => new
            {
                b.RoomId,
                RoomName = b.Room.Name,
                StudioName = b.Room.Studio.Name,
                b.TotalPrice,
            })
            .ToListAsync(ct);

        return rows
            .GroupBy(x => new { x.RoomId, x.RoomName, x.StudioName })
            .Select(g => new TopRoomDto(
                g.Key.RoomId,
                g.Key.RoomName,
                g.Key.StudioName,
                g.Count(),
                g.Sum(x => x.TotalPrice)))
            .OrderByDescending(x => x.TotalBookings)
            .Take(20)
            .ToList();
    }
}
