import React, { useState, useEffect } from "react";
import { FaLock, FaUnlock } from "react-icons/fa";
import { isUserInGroup, joinGroup } from "../utils/firebase";

const GroupMembership = ({ group, userSchool }) => {
  const [isInGroup, setIsInGroup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMembership = async () => {
      try {
        const inGroup = await isUserInGroup(group.id);
        setIsInGroup(inGroup);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'appartenance au groupe :", error);
        setIsLoading(false);
      }
    };
    checkMembership();
  }, [group.id]);

  const handleJoinGroup = () => {
    joinGroup(group.id)
      .then(() => {
        console.log("Vous avez rejoint le groupe avec succès !");
        setIsInGroup(true);
      })
      .catch((error) => {
        console.error("Erreur lors de la tentative de rejoindre le groupe :", error);
      });
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (group.isPublic || group.school === userSchool) {
    if (isInGroup) {
      return <div>Rejoint</div>;
    } else {
      return (
        <button onClick={handleJoinGroup}>
          Rejoindre
        </button>
      );
    }
  } else {
    return <FaLock />;
  }
};

export default GroupMembership;