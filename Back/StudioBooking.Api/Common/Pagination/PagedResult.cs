namespace StudioBooking.Api.Common.Pagination;

public class PagedResult<T>
{
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int Total { get; init; }
    public IEnumerable<T> Data { get; init; } = Enumerable.Empty<T>();

    public static PagedResult<T> From(IEnumerable<T> data, int total, int page, int pageSize) =>
        new() { Data = data, Total = total, Page = page, PageSize = pageSize };
}
