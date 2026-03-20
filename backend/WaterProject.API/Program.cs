using Microsoft.EntityFrameworkCore;
using WaterProject.API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// register the SQLite database connection
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite("Data Source=data/Bookstore.sqlite"));

// allow the frontend dev server to call the API
builder.Services.AddCors(options =>
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
