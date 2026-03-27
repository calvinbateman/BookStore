using Microsoft.EntityFrameworkCore;
using WaterProject.API.Models;

namespace WaterProject.API.Data;

// gives Entity Framework access to the database
public class BookstoreContext : DbContext
{
    public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options) { }

    // represents the Books table
    public DbSet<Book> Books { get; set; }
}
