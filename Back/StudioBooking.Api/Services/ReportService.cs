using Microsoft.EntityFrameworkCore;
using StudioBooking.Api.Auth;
using StudioBooking.Api.Common.Exceptions;
using StudioBooking.Api.Data;
using StudioBooking.Api.DTOs.Common;
using StudioBooking.Api.Repositories.Interfaces;

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
        var q = _db.Bookings
            .Where(b => b.Date >= cutoff && (b.Status == Models.Entities.BookingStatus.Confirmed || b.Status == Models.Entities.BookingStatus.Completed))
            .Join(_db.Rooms, b => b.RoomId, r => r.RoomId, (b, r) => new { b, r })
            .Join(_db.Studios, x => x.r.StudioId, s => s.StudioId, (x, s) => new { x.b, x.r, s });

        if (_currentUser.Role == Roles.Owner)
            q = q.Where(x => x.s.AdminId == _currentUser.UserId);

        var grouped = await q
            .GroupBy(x => new { x.s.StudioId, x.s.Name, x.b.Date })
            .Select(g => new
            {
                g.Key.StudioId, g.Key.Name,
                Year = g.Key.Date.Year, Month = g.Key.Date.Month,
                Count = g.Count(),
            })
            .GroupBy(x => new { x.StudioId, x.Name, x.Year, x.Month })
            .Select(g => new OccupancyReportItemDto(
                g.Key.StudioId, g.Key.Name,
                g.Key.Month, g.Key.Year,
                g.Sum(x => x.Count), 0))
            .OrderBy(x => x.StudioId).ThenBy(x => x.Year).ThenBy(x => x.Month)
            .ToListAsync(ct);

        return grouped;
    }

    public async Task<IEnumerable<RevenueReportItemDto>> GetRevenueAsync(CancellationToken ct)
    {
        var cutoff = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-7));
        var q = _db.Bookings
            .Where(b => b.Date >= cutoff && (b.Status == Models.Entities.BookingStatus.Confirmed || b.Status == Models.Entities.BookingStatus.Completed))
            .Join(_db.Rooms, b => b.RoomId, r => r.RoomId, (b, r) => new { b, r })
            .Join(_db.Studios, x => x.r.StudioId, s => s.StudioId, (x, s) => new { x.b, s });

        if (_currentUser.Role == Roles.Owner)
            q = q.Where(x => x.s.AdminId == _currentUser.UserId);

        return await q
            .GroupBy(x => new { x.s.StudioId, x.s.Name, x.b.Date.Year, x.b.Date.Month })
            .Select(g => new RevenueReportItemDto(
                g.Key.StudioId, g.Key.Name,
                g.Key.Month, g.Key.Year,
                g.Sum(x => x.b.TotalPrice)))
            .OrderBy(x => x.StudioId).ThenBy(x => x.Year).ThenBy(x => x.Month)
            .ToListAsync(ct);
    }

    public async Task<IEnumerable<TopRoomDto>> GetTopRoomsAsync(CancellationToken ct)
    {
        var cutoff = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-7));
        var q = _db.Bookings
            .Where(b => b.Date >= cutoff && b.Status != Models.Entities.BookingStatus.Cancelled)
            .Join(_db.Rooms, b => b.RoomId, r => r.RoomId, (b, r) => new { b, r })
            .Join(_db.Studios, x => x.r.StudioId, s => s.StudioId, (x, s) => new { x.b, x.r, s });

        if (_currentUser.Role == Roles.Owner)
            q = q.Where(x => x.s.AdminId == _currentUser.UserId);

        return await q
            .GroupBy(x => new { x.r.RoomId, RoomName = x.r.Name, StudioName = x.s.Name })
            .Select(g => new TopRoomDto(
                g.Key.RoomId, g.Key.RoomName, g.Key.StudioName,
                g.Count(), g.Sum(x => x.b.TotalPrice)))
            .OrderByDescending(x => x.TotalBookings)
            .Take(20)
            .ToListAsync(ct);
    }
}
