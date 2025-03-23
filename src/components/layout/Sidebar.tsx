import React from "react";
import { SearchBar } from "../ui/SearchBar";

interface SidebarProps {
  userName: string;
  userAvatar?: string;
}

export function Sidebar({ userName, userAvatar }: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-50 border border flex flex-col max-md:w-[200px] max-sm:hidden">
      <div className="h-[57px] border border flex items-center px-4">
        <div className="flex items-center gap-2 w-full">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <svg
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[10.5px] h-[14px]"
            >
              <g clipPath="url(#clip0_10_918)">
                <path
                  d="M1.32695 0.926946C1.67422 0.801165 2.0625 0.907805 2.29766 1.18945L9.5 9.83281V1.74999C9.5 1.26601 9.89102 0.874993 10.375 0.874993C10.859 0.874993 11.25 1.26601 11.25 1.74999V12.25C11.25 12.6191 11.0203 12.9473 10.673 13.073C10.3258 13.1988 9.9375 13.0922 9.70234 12.8105L2.5 4.16718V12.25C2.5 12.734 2.10898 13.125 1.625 13.125C1.14102 13.125 0.75 12.734 0.75 12.25V1.74999C0.75 1.38085 0.979688 1.05273 1.32695 0.926946Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_10_918">
                  <path d="M0.75 0H11.25V14H0.75V0Z" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="text-base font-semibold text-gray-800">
            Workspace Name
          </div>
          <div className="ml-auto">
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[16px] h-[16px]"
            >
              <path d="M0.109375 0H16.1094V16H0.109375V0Z" stroke="#E5E7EB" />
              <path
                d="M7.40312 12.7062C7.79374 13.0969 8.42812 13.0969 8.81874 12.7062L14.8187 6.70624C15.2094 6.31562 15.2094 5.68124 14.8187 5.29062C14.4281 4.89999 13.7937 4.89999 13.4031 5.29062L8.10937 10.5844L2.81562 5.29374C2.42499 4.90312 1.79062 4.90312 1.39999 5.29374C1.00937 5.68437 1.00937 6.31874 1.39999 6.70937L7.39999 12.7094L7.40312 12.7062Z"
                fill="black"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-3">
        <SearchBar />
      </div>

      <nav>
        <div className="px-3 py-2">
          <h2 className="text-xs text-gray-500 mb-2 px-1">FAVORITES</h2>
          <ul className="flex flex-col gap-1">
            <li>
              <a
                href="#"
                className="flex items-center gap-1.5 rounded px-1 py-[5px] hover:bg-gray-100"
              >
                <svg
                  width="18"
                  height="16"
                  viewBox="0 0 18 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[18px] h-[16px]"
                >
                  <g clipPath="url(#clip0_10_921)">
                    <path
                      d="M8.99687 0C9.28438 0 9.54688 0.1625 9.67188 0.421875L11.8156 4.8375L16.6031 5.54375C16.8844 5.58437 17.1187 5.78125 17.2062 6.05312C17.2937 6.325 17.2219 6.61875 17.0219 6.81875L13.55 10.2625L14.3687 15.125C14.4156 15.4062 14.3 15.6906 14.0688 15.8594C13.8375 16.0281 13.5281 16.0469 13.2781 15.9125L8.99687 13.625L4.71875 15.9094C4.46563 16.0438 4.15938 16.025 3.92813 15.8562C3.69688 15.6875 3.57813 15.4031 3.625 15.1219L4.44375 10.2594L0.971875 6.81875C0.76875 6.61875 0.7 6.32188 0.7875 6.05312C0.875 5.78437 1.10938 5.5875 1.39063 5.54375L6.17813 4.8375L8.32188 0.421875C8.45 0.1625 8.70937 0 8.99687 0ZM8.99687 2.46875L7.35625 5.85C7.24688 6.07188 7.0375 6.22813 6.79063 6.26562L3.09375 6.80937L5.77813 9.46875C5.95 9.64062 6.03125 9.88437 5.99063 10.125L5.35625 13.8656L8.64375 12.1094C8.86563 11.9906 9.13125 11.9906 9.35 12.1094L12.6375 13.8656L12.0063 10.1281C11.9656 9.8875 12.0437 9.64375 12.2188 9.47188L14.9031 6.8125L11.2063 6.26562C10.9625 6.22813 10.75 6.075 10.6406 5.85L8.99687 2.46875Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_10_921">
                      <path d="M0 0H18V16H0V0Z" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-sm text-gray-700">Getting Started</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-1.5 rounded px-1 py-[5px] hover:bg-gray-100"
              >
                <svg
                  width="18"
                  height="16"
                  viewBox="0 0 18 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[18px] h-[16px]"
                >
                  <g clipPath="url(#clip0_10_926)">
                    <path
                      d="M8.99687 0C9.28438 0 9.54688 0.1625 9.67188 0.421875L11.8156 4.8375L16.6031 5.54375C16.8844 5.58437 17.1187 5.78125 17.2062 6.05312C17.2937 6.325 17.2219 6.61875 17.0219 6.81875L13.55 10.2625L14.3687 15.125C14.4156 15.4062 14.3 15.6906 14.0688 15.8594C13.8375 16.0281 13.5281 16.0469 13.2781 15.9125L8.99687 13.625L4.71875 15.9094C4.46563 16.0438 4.15938 16.025 3.92813 15.8562C3.69688 15.6875 3.57813 15.4031 3.625 15.1219L4.44375 10.2594L0.971875 6.81875C0.76875 6.61875 0.7 6.32188 0.7875 6.05312C0.875 5.78437 1.10938 5.5875 1.39063 5.54375L6.17813 4.8375L8.32188 0.421875C8.45 0.1625 8.70937 0 8.99687 0ZM8.99687 2.46875L7.35625 5.85C7.24688 6.07188 7.0375 6.22813 6.79063 6.26562L3.09375 6.80937L5.77813 9.46875C5.95 9.64062 6.03125 9.88437 5.99063 10.125L5.35625 13.8656L8.64375 12.1094C8.86563 11.9906 9.13125 11.9906 9.35 12.1094L12.6375 13.8656L12.0063 10.1281C11.9656 9.8875 12.0437 9.64375 12.2188 9.47188L14.9031 6.8125L11.2063 6.26562C10.9625 6.22813 10.75 6.075 10.6406 5.85L8.99687 2.46875Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_10_926">
                      <path d="M0 0H18V16H0V0Z" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-sm text-gray-700">Product Roadmap</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="px-3 py-2">
          <h2 className="text-xs text-gray-500 mb-2 px-1">WORKSPACE</h2>
          <ul className="flex flex-col gap-1">
            <li>
              <a
                href="#"
                className="flex items-center gap-3 rounded px-1 py-[5px] hover:bg-gray-100"
              >
                <svg
                  width="12"
                  height="16"
                  viewBox="0 0 12 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[12px] h-[16px]"
                >
                  <g clipPath="url(#clip0_10_931)">
                    <path
                      d="M10 14.5C10.275 14.5 10.5 14.275 10.5 14V5H8C7.44688 5 7 4.55312 7 4V1.5H2C1.725 1.5 1.5 1.725 1.5 2V14C1.5 14.275 1.725 14.5 2 14.5H10ZM0 2C0 0.896875 0.896875 0 2 0H7.17188C7.70312 0 8.2125 0.209375 8.5875 0.584375L11.4156 3.4125C11.7906 3.7875 12 4.29688 12 4.82812V14C12 15.1031 11.1031 16 10 16H2C0.896875 16 0 15.1031 0 14V2Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_10_931">
                      <path d="M0 0H12V16H0V0Z" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-sm text-gray-700">Documentation</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2.5 rounded px-1 py-[5px] hover:bg-gray-100"
              >
                <svg
                  width="14"
                  height="16"
                  viewBox="0 0 14 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[14px] h-[16px]"
                >
                  <g clipPath="url(#clip0_10_936)">
                    <path
                      d="M4.75 0.75C4.75 0.334375 4.41563 0 4 0C3.58437 0 3.25 0.334375 3.25 0.75V2H2C0.896875 2 0 2.89687 0 4V4.5V6V14C0 15.1031 0.896875 16 2 16H12C13.1031 16 14 15.1031 14 14V6V4.5V4C14 2.89687 13.1031 2 12 2H10.75V0.75C10.75 0.334375 10.4156 0 10 0C9.58438 0 9.25 0.334375 9.25 0.75V2H4.75V0.75ZM1.5 6H12.5V14C12.5 14.275 12.275 14.5 12 14.5H2C1.725 14.5 1.5 14.275 1.5 14V6Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_10_936">
                      <path d="M0 0H14V16H0V0Z" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-sm text-gray-700">Team Calendar</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2 rounded px-1 py-[5px] hover:bg-gray-100"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[16px] h-[16px]"
                >
                  <g clipPath="url(#clip0_10_941)">
                    <path
                      d="M4.89062 13.9906L4.49687 14.9125C3.9125 14.6156 3.375 14.25 2.8875 13.8219L3.59687 13.1125C3.9875 13.4531 4.42188 13.75 4.89062 13.9906ZM1.26875 8.5H0.265625C0.309375 9.1625 0.434375 9.80313 0.63125 10.4094L1.5625 10.0375C1.40937 9.54688 1.30625 9.03125 1.26875 8.5ZM1.26875 7.5C1.3125 6.9125 1.43125 6.34375 1.61563 5.80937L0.69375 5.41563C0.459375 6.07188 0.3125 6.77187 0.265625 7.5H1.26875ZM2.00938 4.89062C2.25313 4.425 2.54688 3.99062 2.8875 3.59375L2.17812 2.88438C1.75 3.37188 1.38125 3.90938 1.0875 4.49375L2.00938 4.89062ZM12.4062 13.1125C11.9719 13.4875 11.4875 13.8094 10.9656 14.0625L11.3375 14.9937C11.9844 14.6844 12.5813 14.2875 13.1156 13.8188L12.4062 13.1125ZM3.59375 2.8875C4.02813 2.5125 4.5125 2.19062 5.03438 1.9375L4.6625 1.00625C4.01562 1.31562 3.41875 1.7125 2.8875 2.18125L3.59375 2.8875ZM13.9906 11.1094C13.7469 11.575 13.4531 12.0094 13.1125 12.4062L13.8219 13.1156C14.25 12.6281 14.6188 12.0875 14.9125 11.5063L13.9906 11.1094ZM14.7312 8.5C14.6875 9.0875 14.5687 9.65625 14.3844 10.1906L15.3062 10.5844C15.5406 9.925 15.6875 9.225 15.7312 8.49687H14.7312V8.5ZM10.0375 14.4375C9.54688 14.5938 9.03125 14.6937 8.5 14.7312V15.7344C9.1625 15.6906 9.80313 15.5656 10.4094 15.3687L10.0375 14.4375ZM7.5 14.7312C6.9125 14.6875 6.34375 14.5687 5.80937 14.3844L5.41563 15.3062C6.075 15.5406 6.775 15.6875 7.50313 15.7312V14.7312H7.5ZM14.4375 5.9625C14.5938 6.45312 14.6937 6.96875 14.7312 7.5H15.7344C15.6906 6.8375 15.5656 6.19687 15.3687 5.59062L14.4375 5.9625ZM2.8875 12.4062C2.5125 11.9719 2.19062 11.4875 1.9375 10.9656L1.00625 11.3375C1.31562 11.9844 1.7125 12.5813 2.18125 13.1156L2.8875 12.4062ZM8.5 1.26875C9.0875 1.3125 9.65312 1.43125 10.1906 1.61563L10.5844 0.69375C9.92813 0.459375 9.22812 0.3125 8.5 0.265625V1.26875ZM5.9625 1.5625C6.45312 1.40625 6.96875 1.30625 7.5 1.26875V0.265625C6.8375 0.309375 6.19687 0.434375 5.59062 0.63125L5.9625 1.5625ZM13.8219 2.88438L13.1125 3.59375C13.4875 4.02813 13.8094 4.5125 14.0656 5.03438L14.9969 4.6625C14.6875 4.01562 14.2906 3.41875 13.8219 2.88438ZM12.4062 2.8875L13.1156 2.17812C12.6281 1.75 12.0906 1.38125 11.5063 1.0875L11.1125 2.00938C11.575 2.25313 12.0125 2.54688 12.4062 2.8875Z"
                      fill="black"
                    />
                    <path
                      d="M8 12.25C8.48325 12.25 8.875 11.8582 8.875 11.375C8.875 10.8918 8.48325 10.5 8 10.5C7.51675 10.5 7.125 10.8918 7.125 11.375C7.125 11.8582 7.51675 12.25 8 12.25Z"
                      fill="black"
                    />
                    <path
                      d="M8.24063 9.75H7.74062C7.53437 9.75 7.36562 9.58125 7.36562 9.375C7.36562 7.15625 9.78437 7.37812 9.78437 6.00625C9.78437 5.38125 9.22812 4.75 7.99062 4.75C7.08125 4.75 6.60625 5.05 6.14062 5.64687C6.01875 5.80312 5.79375 5.83438 5.63437 5.72188L5.225 5.43437C5.05 5.3125 5.00937 5.06562 5.14375 4.89687C5.80625 4.04687 6.59375 3.5 7.99375 3.5C9.62812 3.5 11.0375 4.43125 11.0375 6.00625C11.0375 8.11875 8.61875 7.99062 8.61875 9.375C8.61562 9.58125 8.44688 9.75 8.24063 9.75Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_10_941">
                      <path d="M0 0H16V16H0V0Z" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-sm text-gray-700">Project Database</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="border border mt-auto px-4 py-[17px]">
        <div className="flex items-center gap-2">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={`${userName}'s avatar`}
              className="w-[24px] h-[24px] rounded-full"
            />
          ) : (
            <div className="w-[24px] h-[24px] rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs text-gray-600">
                {userName.charAt(0)}
              </span>
            </div>
          )}
          <span className="text-sm text-gray-700">{userName}</span>
        </div>
      </div>
    </aside>
  );
}
