import React, { useState, useEffect } from "react";
import { FaLock, FaUnlock } from "react-icons/fa";
import { isUserInGroup, joinGroup, leaveGroup } from "../utils/firebase";
import "../styles/groupMembership.css";

const GroupMembership = ({ group, userSchool }) => {
  const [isInGroup, setIsInGroup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    setIsTransitioning(true);
    joinGroup(group.id)
      .then(() => {
        console.log("Vous avez rejoint le groupe avec succès !");
        setIsInGroup(true);
        // Délai de 2 secondes (2000 millisecondes) avant de désactiver l'état de transition
        setTimeout(() => {
          setIsTransitioning(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Erreur lors de la tentative de rejoindre le groupe :", error);
        setIsTransitioning(false);
      });
  };
  
  const handleLeaveGroup = () => {
    setIsTransitioning(true);
    leaveGroup(group.id)
      .then(() => {
        console.log("Vous avez quitté le groupe avec succès !");
        setIsInGroup(false);
        // Délai de 2 secondes (2000 millisecondes) avant de désactiver l'état de transition
        setTimeout(() => {
          setIsTransitioning(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Erreur lors de la tentative de quitter le groupe :", error);
        setIsTransitioning(false);
      });
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (group.isPublic || group.school === userSchool) {
    if (isTransitioning) {
      return (
            <button className="disabled-group-button" onClick={handleLeaveGroup}>
                {isInGroup ? "Rejoint" : "Quitté"}
            </button>
            );
    } else if (isInGroup) {
      return (
        <button className="leave-group-button" onClick={handleLeaveGroup}>
          Quitter le groupe
        </button>
      );
    } else {
      return (
        <button className="join-group-button" onClick={handleJoinGroup}>
          Rejoindre
        </button>
      );
    }
  } else {
    return <FaLock />;
  }
};

export default GroupMembership;