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
    public class PostItRepository : IPostItRepository
    {
        private ApplicationDbContext _context;

        public PostItRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public IQueryable<PostIt> All()
        {
            return _context.PostIts;
        }

        public IQueryable<PostIt> AllForTemplate(string from, string to, int id)
        {
            return _context.PostIts.Where(x => x.TemplateNo == id);
        }

        public IQueryable<PostIt> AllForEmployee(string from, string to, int employeeId, int templateId)
        {
            return _context.PostIts.Where(x => x.EmployeeId == employeeId && x.TemplateNo == templateId);
        }
        public IQueryable<PostIt> AllForTemplate(int id)
        {
            return _context.PostIts.Where(x => x.TemplateNo == id);
        }

        public IQueryable<PostIt> AllForEmployee(int employeeId, int templateId)
        {
            return _context.PostIts.Where(x => x.EmployeeId == employeeId && x.TemplateNo == templateId);
        }
        public IQueryable<PostIt> AllForEmployee(int employeeId)
        {
            return _context.PostIts.Where(x => x.EmployeeId == employeeId);
        }

        public IQueryable<PostIt> AllForCustomer(int customerId)
        {
            return _context.PostIts.Where(x => x.CustomerId == customerId);
        }

        public IQueryable<PostIt> AllIncluding(params Expression<Func<PostIt, object>>[] includeProperties)
        {
            return includeProperties.Aggregate<Expression<Func<PostIt, object>>,
            IQueryable<PostIt>>(_context.PostIts,
            (current, includeProperty) => current.Include(includeProperty));
        }

        public void Delete(int id)
        {
            PostIt postIt = Find(id);
            _context.PostIts.Remove(postIt);
        }

        public PostIt Find(int id)
        {
            return _context.PostIts.Find(id);
        }

        public void Insert(PostIt postit)
        {
            _context.PostIts.Add(postit);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public void Update(PostIt postit)
        {
            _context.Entry(postit).State = EntityState.Modified;
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