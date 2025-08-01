import { Steps } from "../login-button";

type CreateUserProps = {
  setSteps: (steps: Steps) => void;
  phone: string;
};

export const  CreateUser = ({ setSteps, phone }: CreateUserProps) => {
  return <div>CreateUser</div>;
};