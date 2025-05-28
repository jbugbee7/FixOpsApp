
export interface Problem {
  problem: string;
  likelihood: string;
  firstSteps: string[];
  possibleCauses: string[];
}

export interface ApplianceGuide {
  type: string;
  commonProblems: Problem[];
}

export const applianceGuides: ApplianceGuide[] = [
  {
    type: "Refrigerator",
    commonProblems: [
      {
        problem: "Not Cooling",
        likelihood: "Very High",
        firstSteps: [
          "Check power supply and circuit breaker",
          "Verify temperature settings (should be 37-40°F)",
          "Clean condenser coils (back or bottom)",
          "Check door seals for air leaks",
          "Listen for compressor operation"
        ],
        possibleCauses: ["Dirty coils", "Faulty thermostat", "Compressor issues", "Refrigerant leak"]
      },
      {
        problem: "Water Leaking",
        likelihood: "High",
        firstSteps: [
          "Check drain pan under unit",
          "Clear drain tube blockage",
          "Inspect water filter connections",
          "Check ice maker water lines"
        ],
        possibleCauses: ["Blocked drain", "Damaged water lines", "Faulty ice maker"]
      },
      {
        problem: "Strange Noises",
        likelihood: "Medium",
        firstSteps: [
          "Identify noise location (compressor, fan, ice maker)",
          "Check for loose items inside",
          "Inspect fan blades for obstructions",
          "Level the refrigerator"
        ],
        possibleCauses: ["Fan motor issues", "Compressor problems", "Loose components"]
      }
    ]
  },
  {
    type: "Washing Machine",
    commonProblems: [
      {
        problem: "Won't Drain",
        likelihood: "Very High",
        firstSteps: [
          "Check for clogs in drain hose",
          "Inspect pump filter for debris",
          "Verify drain hose isn't kinked",
          "Test lid switch operation"
        ],
        possibleCauses: ["Clogged pump", "Faulty drain pump", "Blocked drain hose"]
      },
      {
        problem: "Won't Spin",
        likelihood: "High",
        firstSteps: [
          "Check load balance",
          "Inspect drive belt",
          "Test lid switch",
          "Examine motor coupling"
        ],
        possibleCauses: ["Unbalanced load", "Broken belt", "Motor issues"]
      },
      {
        problem: "Leaking Water",
        likelihood: "Medium",
        firstSteps: [
          "Check hose connections",
          "Inspect door seal",
          "Examine water pump",
          "Check for overloading"
        ],
        possibleCauses: ["Worn seals", "Loose connections", "Damaged hoses"]
      }
    ]
  },
  {
    type: "Dryer",
    commonProblems: [
      {
        problem: "Not Heating",
        likelihood: "Very High",
        firstSteps: [
          "Check lint filter and clean thoroughly",
          "Inspect exhaust vent for blockages",
          "Test heating element continuity",
          "Verify gas supply (gas dryers)"
        ],
        possibleCauses: ["Clogged vent", "Faulty heating element", "Bad thermostat"]
      },
      {
        problem: "Takes Too Long",
        likelihood: "High",
        firstSteps: [
          "Clean lint filter",
          "Check exhaust vent",
          "Reduce load size",
          "Inspect moisture sensor"
        ],
        possibleCauses: ["Poor airflow", "Faulty sensors", "Overloading"]
      }
    ]
  },
  {
    type: "Dishwasher",
    commonProblems: [
      {
        problem: "Not Cleaning Properly",
        likelihood: "High",
        firstSteps: [
          "Check spray arm for clogs",
          "Clean filter assembly",
          "Verify water temperature (120°F)",
          "Inspect detergent dispenser"
        ],
        possibleCauses: ["Clogged spray arms", "Dirty filter", "Water temperature issues"]
      },
      {
        problem: "Not Draining",
        likelihood: "Medium",
        firstSteps: [
          "Check garbage disposal (if connected)",
          "Inspect drain hose",
          "Clean filter",
          "Check for food debris"
        ],
        possibleCauses: ["Clogged drain", "Faulty pump", "Blocked filter"]
      }
    ]
  },
  {
    type: "Oven",
    commonProblems: [
      {
        problem: "Not Heating",
        likelihood: "High",
        firstSteps: [
          "Check circuit breaker",
          "Test bake and broil elements",
          "Verify thermostat operation",
          "Inspect igniter (gas ovens)"
        ],
        possibleCauses: ["Faulty heating element", "Bad thermostat", "Igniter issues"]
      },
      {
        problem: "Uneven Cooking",
        likelihood: "Medium",
        firstSteps: [
          "Check rack positioning",
          "Test temperature accuracy",
          "Inspect door seal",
          "Calibrate thermostat"
        ],
        possibleCauses: ["Poor air circulation", "Temperature calibration", "Damaged seals"]
      }
    ]
  }
];
