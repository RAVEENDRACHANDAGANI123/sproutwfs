import React from 'react';
import { Layers, Users, Briefcase, CalendarCheck, ShieldCheck, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-500 to-sprout-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              S
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900">SproutWFS <span className="text-brand-500 font-extrabold">HR</span></span>
              <span className="ml-2 text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-semibold border border-brand-100">Enterprise v0.1.0</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <span className="inline-flex items-center text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-full text-xs border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Foundation Ready
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Hero */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>Modular Monolith Architecture</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mb-4">
              Enterprise HR & Recruitment Management Platform
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              The project foundation is active. Backend FastAPI services and frontend React modules are decoupled and structured for domain-driven enterprise growth.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 transition shadow-sm"
              >
                <span>Explore FastAPI Swagger API</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <span className="inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-100 text-slate-700">
                PostgreSQL 16 Active
              </span>
            </div>
          </div>
        </div>

        {/* Modular Architecture Grid */}
        <h2 className="text-xl font-bold text-slate-900 mb-6">Architecture Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Module 1: Auth */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-brand-500 transition group">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Identity & RBAC</h3>
            <p className="text-slate-500 text-sm leading-normal">
              JWT stateless authentication, session management, and fine-grained role permissions.
            </p>
          </div>

          {/* Module 2: Recruitment */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-brand-500 transition group">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Recruitment (ATS)</h3>
            <p className="text-slate-500 text-sm leading-normal">
              Requisitions, candidate pipelines, interview scheduling, and offer letter workflows.
            </p>
          </div>

          {/* Module 3: Core HR */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-brand-500 transition group">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Core HR & Directory</h3>
            <p className="text-slate-500 text-sm leading-normal">
              Employee master profiles, department hierarchies, org charts, and document vaults.
            </p>
          </div>

          {/* Module 4: Payroll & Leave */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-brand-500 transition group">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Time & Compliance</h3>
            <p className="text-slate-500 text-sm leading-normal">
              Leave management, attendance logs, and India statutory deductions (PF, ESI, TDS).
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        © 2026 Sprout Workforce Solutions. SproutWFS HR Enterprise Platform.
      </footer>
    </div>
  );
};

export default App;
