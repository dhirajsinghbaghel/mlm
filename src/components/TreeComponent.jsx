import React, { useState, useEffect, useRef } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { User, Wallet, Calendar, Hash, Shield } from 'lucide-react';

const MemberNode = ({ member, isRoot = false }) => {
    // Mobile click aur Desktop hover handle karne ke liye state
    const [showTooltip, setShowTooltip] = useState(false);
    const nodeRef = useRef(null);

    // Agar mobile me bahar click karein toh tooltip band ho jaye
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (nodeRef.current && !nodeRef.current.contains(event.target)) {
                setShowTooltip(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Coloring logic: Root (Orange/Red), Direct L1 (Dark Blue), Indirect L2+ (Light Blue)
    const bubbleColor = isRoot
        ? 'bg-gradient-to-b from-orange-400 to-red-500 border-red-600'
        : member.level === 1
            ? 'bg-gradient-to-b from-[#1e88e5] to-[#1565c0] border-[#1565c0]' // Darker Blue for Direct
            : 'bg-gradient-to-b from-[#60b0ff] to-[#42a5f5] border-[#42a5f5]'; // Lighter Blue for Indirect

    return (
        <div
            ref={nodeRef}
            className="relative inline-flex flex-col items-center cursor-pointer pb-6"
            onMouseEnter={() => setShowTooltip(true)}   // Laptop ke liye Hover
            onMouseLeave={() => setShowTooltip(false)}  // Laptop ke liye Hover out
            onClick={() => setShowTooltip(!showTooltip)} // Mobile ke liye Click
        >
            {/* The Person Icon Bubble */}
            <div className={`w-14 h-16 rounded-[40%] flex items-center justify-center shadow-md transition-transform duration-300 ${showTooltip ? 'scale-110' : ''} z-10 relative border-b-4 ${bubbleColor}`}>
                <User size={30} className="text-white/90 drop-shadow-sm mb-1" fill="currentColor" />
                {/* Red Arrow on top for root effect */}
                {isRoot && <div className="absolute -top-3 text-red-600 text-lg animate-bounce">⇧</div>}
            </div>

            {/* Text below node */}
            <span className="mt-2 text-xs font-bold text-gray-800">{member.name ? member.name.split(' ')[0] : 'Member'}</span>
            {!isRoot && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${member.level === 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {member.level === 1 ? 'Direct' : `Level ${member.level}`}
                </span>
            )}

            {/* Premium Details Tooltip */}
            <div className={`absolute top-0 left-16 sm:left-20 transition-all duration-200 z-50 w-64 ${showTooltip ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible -translate-x-2'}`}>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-4 text-left relative overflow-hidden">

                    {/* Tooltip Header */}
                    <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
                        <div>
                            <p className="text-sm font-extrabold text-gray-900">{member.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{isRoot ? 'Root Node (You)' : `${member.type} Member`}</p>
                        </div>
                        {!isRoot && (
                            <div className={`px-2 py-1 rounded-md text-[10px] font-bold ${member.level === 1 ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'}`}>
                                Lvl {member.level}
                            </div>
                        )}
                    </div>

                    {/* Details List */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Hash size={14} className="text-gray-400" />
                            <p className="text-xs font-medium text-gray-600">ID: <span className="font-bold text-gray-900">{member.referral_code}</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            <p className="text-xs font-medium text-gray-600">Joined: <span className="font-bold text-gray-900">{member.created_at ? new Date(member.created_at).toLocaleDateString() : 'N/A'}</span></p>
                        </div>

                        {/* Earning Status */}
                        {!isRoot && (
                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <div className="p-1 bg-green-50 rounded-md"><Wallet size={12} className="text-green-600" /></div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Total Earned</p>
                                </div>
                                <p className="text-sm font-extrabold text-green-600">₹{parseFloat(member.total_earned || 0).toFixed(2)}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const renderTreeNodes = (downlineArray) => {
    if (!downlineArray || downlineArray.length === 0) return null;
    return downlineArray.map((child) => (
        <TreeNode key={child.id} label={<MemberNode member={child} />}>
            {child.downline && child.downline.length > 0 && renderTreeNodes(child.downline)}
        </TreeNode>
    ));
};

const MyTeamTree = ({ treeData }) => {
    // Current user root
    const currentUser = JSON.parse(localStorage.getItem('user')) || { name: 'You', referral_code: 'ROOT' };

    return (
        <div className="overflow-x-auto overflow-y-hidden p-6 sm:p-12 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 min-h-[500px] w-full flex justify-center hide-scrollbar">
            <Tree
                lineWidth={'2px'}
                lineColor={'#e4e4e7'} // Soft gray lines
                lineBorderRadius={'10px'} // Soft rounded corners for lines
                lineHeight={'40px'}
                nodePadding={'20px'}
                label={<MemberNode member={currentUser} isRoot={true} />}
            >
                {renderTreeNodes(treeData)}
            </Tree>
        </div>
    );
};

export default MyTeamTree;