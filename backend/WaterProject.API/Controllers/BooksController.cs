using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WaterProject.API.Data;

namespace WaterProject.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BookstoreContext _context;

    // inject the DB context via constructor
    public BooksController(BookstoreContext context)
    {
        _context = context;
    }

    // GET /api/books?pageNum=1&pageSize=5&sortOrder=asc
    [HttpGet]
    public async Task<IActionResult> GetBooks(
        int pageNum = 1,
        int pageSize = 5,
        string sortOrder = "asc")
    {
        var query = _context.Books.AsQueryable();

        // sort ascending or descending by title
        query = sortOrder == "desc"
            ? query.OrderByDescending(b => b.Title)
            : query.OrderBy(b => b.Title);

        var totalCount = await query.CountAsync();

        // grab just the books for the requested page
        var books = await query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // return both the books and the total so the frontend can calculate pages
        return Ok(new { books, totalCount });
    }
}
