using Fjordens_Service_ver2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Fjordens_Service_ver2.DAL.Contracts
{
    interface IEmployeeRepository : IDisposable
    {
        IQueryable<Employee> AllIncluding(params Expression<Func<Employee, object>>[] includeProperties);
        Employee Find(int id);
        void Insert(Employee employee);
        void Update(Employee employee);
        void Delete(int id);
        void Save();
    }
}
