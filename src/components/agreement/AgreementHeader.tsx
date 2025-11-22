
import { Wrench } from 'lucide-react';

const AgreementHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gun-metal/10 dark:bg-gun-metal/20 rounded-lg flex items-center justify-center mx-auto mb-4">
        <Wrench className="h-8 w-8 text-gun-metal dark:text-gun-metal" />
      </div>
      <h1 className="text-3xl font-bold text-gun-metal dark:text-gun-metal">
        FixOps
      </h1>
    </div>
  );
};

export default AgreementHeader;
