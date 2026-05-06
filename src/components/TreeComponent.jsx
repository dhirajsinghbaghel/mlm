import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { User } from 'lucide-react';

const MemberNode = ({ member, isRoot = false }) => {
    // Coloring logic matching the reference image (Blue for members, distinct for root)
    const bubbleColor = isRoot
        ? 'bg-gradient-to-b from-orange-400 to-red-500 border-red-600'
        : 'bg-gradient-to-b from-[#60b0ff] to-[#1e88e5] border-[#1e88e5]'; // Classic light blue

    return (
        <div className="relative group inline-flex flex-col items-center cursor-pointer pb-6">
            {/* The Person Icon Bubble */}
            <div className={`w-14 h-16 rounded-[40%] flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 z-10 relative border-b-4 ${bubbleColor}`}>
                <User size={30} className="text-white/90 drop-shadow-sm mb-1" fill="currentColor" />
                {/* Red Arrow on top for effect (like image) */}
                <div className="absolute -top-3 text-red-600 text-lg">⇧</div>
            </div>

            {/* Text below node */}
            <span className="mt-2 text-xs font-bold text-blue-700 hover:underline">{member.referral_code}</span>
            <span className="text-[10px] text-gray-500">0</span>

            {/* Classic Hover Tooltip (Square with teal border) */}
            <div className="absolute top-0 left-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-56">
                <div className="bg-white border-2 border-teal-500 shadow-xl p-3 text-left relative flex items-start gap-3">
                    <div className="w-16 h-20 bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
                        <User size={40} className="text-gray-400 opacity-50" fill="currentColor" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-600 mb-1">Left: {Math.floor(Math.random() * 5)} <br />Right: {Math.floor(Math.random() * 5)}</p>
                    </div>
                    <div className="absolute -bottom-16 left-0 w-full">
                        <p className="text-[10px] text-gray-800 font-bold">Name: {member.name}</p>
                        <p className="text-[10px] text-gray-800 font-bold">User ID: {member.referral_code}</p>
                        <p className="text-[10px] text-gray-800 font-bold">Joining: {new Date().toISOString().split('T')[0]}</p>
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
    const currentUser = JSON.parse(localStorage.getItem('user')) || { name: 'Admin User', referral_code: 'ADMIN_01' };

    return (
        <div className="overflow-x-auto overflow-y-hidden p-12 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 min-h-[600px] w-full flex justify-center">
            <Tree
                lineWidth={'2px'}
                lineColor={'#71717a'} // Dark gray lines like the image
                lineBorderRadius={'0px'} // Sharp corners for lines
                lineHeight={'50px'}
                nodePadding={'20px'}
                label={<MemberNode member={currentUser} isRoot={true} />}
            >
                {renderTreeNodes(treeData)}
            </Tree>
        </div>
    );
};
export default MyTeamTree;