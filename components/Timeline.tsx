
import React from 'react';
import { Stage } from '../types';
import { STAGE_DETAILS } from '../constants';

interface TimelineProps {
  history: Stage[];
}

const Timeline: React.FC<TimelineProps> = ({ history }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Supply Chain History</h3>
      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        {history.slice().reverse().map((stage, index) => {
          const { Icon, description } = STAGE_DETAILS[stage.name] || {};
          return (
            <li key={index} className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-green-100 rounded-full -left-4 ring-8 ring-white dark:ring-gray-900 dark:bg-green-900">
                {Icon && <Icon className="w-5 h-5 text-primary" />}
              </span>
              <h4 className="flex items-center mb-1 text-md font-semibold text-gray-900 dark:text-white">
                {description}
              </h4>
              <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                On {new Date(stage.timestamp).toLocaleString()}
              </time>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                <strong>By:</strong> {stage.actor}
              </p>
              <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-2 truncate" title={stage.txHash}>
                <strong>TxHash:</strong> {stage.txHash}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Timeline;
