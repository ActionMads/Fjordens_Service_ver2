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
    public class CustomerRepository : ICustomerRepository
    {

        private ApplicationDbContext _context;

        public CustomerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public IQueryable<Customer> AllIncluding(params Expression<Func<Customer, object>>[] includeProperties)
        {
            return includeProperties.Aggregate<Expression<Func<Customer, object>>,
            IQueryable<Customer>>(_context.Customers,
            (current, includeProperty) => current.Include(includeProperty));
        }

        public void Delete(int id)
        {
            Customer customer = Find(id);
            _context.Customers.Remove(customer);
        }

        public Customer Find(int id)
        {
            return _context.Customers.Find(id);
        }
        
        public Customer FindByName(string company)
        {
            return _context.Customers.FirstOrDefault(x => x.Company == company);
        }

        public void Insert(Customer customer)
        {
            _context.Customers.Add(customer);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public void Update(Customer customer)
        {
            _context.Entry(customer).State = EntityState.Modified;
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