﻿using Fjordens_Service_ver2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Fjordens_Service_ver2.DAL.Contracts
{
    interface IPostItRepository : IDisposable
    {
        IQueryable<PostIt> All();

        IQueryable<PostIt> AllForTemplate(string from, string to, int id);
        IQueryable<PostIt> AllForTemplate(int id);
        IQueryable<PostIt> AllForEmployee(string from, string to, int employeeId, int templateId);
        IQueryable<PostIt> AllForEmployee(int employeeId);
        IQueryable<PostIt> AllForEmployee(int employeeId, int templateId);
        IQueryable<PostIt> AllForCustomer(int customerId);
        IQueryable<PostIt> AllIncluding(params Expression<Func<PostIt, object>>[] includeProperties);
        PostIt Find(int id);
        void Insert(PostIt postit);
        void Update(PostIt postit);
        void Delete(int id);
        void Save();
    }
}
