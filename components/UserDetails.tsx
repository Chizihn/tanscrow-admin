import React from "react";

interface UserDetailsProps {
  id: string;
}

const UserDetails: React.FC<UserDetailsProps> = ({ id }) => {
  return <div>UserDetails {id} </div>;
};

export default UserDetails;
