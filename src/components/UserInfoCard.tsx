
interface UserInfoCardProps {
  displayName: string;
}

const UserInfoCard = ({ displayName }: UserInfoCardProps) => {
  return (
    <div className="fixed bottom-20 right-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
      <div className="text-right">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{displayName}</p>
      </div>
    </div>
  );
};

export default UserInfoCard;
