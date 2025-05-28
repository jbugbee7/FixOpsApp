
import { Wrench } from 'lucide-react';

const AgreementHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
        <Wrench className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        FixOps
      </h1>
    </div>
  );
};

export default AgreementHeader;
