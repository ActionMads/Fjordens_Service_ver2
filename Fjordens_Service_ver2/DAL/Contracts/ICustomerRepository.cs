using Fjordens_Service_ver2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Fjordens_Service_ver2.DAL.Contracts
{
    interface ICustomerRepository : IDisposable
    {
        IQueryable<Customer> All();
        IQueryable<Customer> AllIncluding(params Expression<Func<Customer, object>>[] includeProperties);
        Customer Find(int id);
        void Insert(Customer customer);
        void Update(Customer customer);
        void Delete(int id);
        void Save();
    }
}
