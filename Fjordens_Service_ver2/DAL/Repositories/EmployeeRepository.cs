using Fjordens_Service_ver2.DAL.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Fjordens_Service_ver2.Models;
using System.Linq.Expressions;
using System.Data.Entity;

namespace Fjordens_Service_ver2.DAL.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {

        private ApplicationDbContext _context;

        public EmployeeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public IQueryable<Employee> AllIncluding(params Expression<Func<Employee, object>>[] includeProperties)
        {
            return includeProperties.Aggregate<Expression<Func<Employee, object>>,
            IQueryable<Employee>>(_context.Employees,
            (current, includeProperty) => current.Include(includeProperty));
        }

        public void Delete(int id)
        {
            Employee employee = Find(id);
            _context.Employees.Remove(employee);
        }

        public Employee Find(int id)
        {
            return _context.Employees.Find(id);
        }

        public Employee FindByName(string name)
        {
            return _context.Employees.FirstOrDefault(x => x.FirstName == name);
        }

        public void Insert(Employee employee)
        {
            _context.Employees.Add(employee);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public void Update(Employee employee)
        {
            _context.Entry(employee).State = EntityState.Modified;
        }

        private bool _disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            _disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}