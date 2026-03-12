import React, { useState } from 'react';
import { CvManager } from '../components/CvManager';
import { JobSpecManager } from '../components/JobSpecManager';
import { ToastContainer } from 'react-toastify';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu';

export function App() {
  const [activeTab, setActiveTab] = useState<'cv' | 'job-spec'>('cv');

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <NavigationMenu className="mx-auto max-w-3xl">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Cv</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('cv');
                      }}
                      className={`block h-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 ${activeTab === 'cv' ? 'bg-gray-100' : ''}`}
                    >
                      <div className="text-sm font-medium">CV List</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        View all CVs
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('cv');
                      }}
                      className={`block h-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 ${activeTab === 'cv' ? 'bg-gray-100' : ''}`}
                    >
                      <div className="text-sm font-medium">Add CV</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Submit a new CV
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Job Spec</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('job-spec');
                      }}
                      className={`block h-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 ${activeTab === 'job-spec' ? 'bg-gray-100' : ''}`}
                    >
                      <div className="text-sm font-medium">Job Spec List</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        View all job specifications
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('job-spec');
                      }}
                      className={`block h-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 ${activeTab === 'job-spec' ? 'bg-gray-100' : ''}`}
                    >
                      <div className="text-sm font-medium">Add Job Spec</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Create a new job specification
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {activeTab === 'cv' ? <CvManager /> : <JobSpecManager />}
        </div>
      </div>
    </div>
  );
}

export default App;
