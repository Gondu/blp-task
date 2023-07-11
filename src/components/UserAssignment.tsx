import {
  Alert,
  Button,
  Dialog,
  Stack,
  StackProps,
  styled,
  Typography,
} from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import React from "react";
import { useQueryClient } from "react-query";
import { ListUsersParams, Entity } from "../queries/types";
import { useAssignUser } from "../queries/useAssignUsers";
import {
  getListUserGroupsQueryKey,
  useListUserGroups,
} from "../queries/useListUserGroups";
import { getListUsersQueryKey, useListUsers } from "../queries/useListUsers";
import { useRemoveUser } from "../queries/useRemoveUsers";

const useInvalidate = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries(getListUsersQueryKey());
    queryClient.invalidateQueries(getListUserGroupsQueryKey());
  };
};

export default function UserAssignment(props: {currentSelectedUser: Entity}) {
  const { currentSelectedUser } = props;
  const [selectedUser, setSelectedUser] = React.useState<Entity | null>(null);
  const [selectedGroupsForAssignment, setSelectedGroupsForAssignment] = React.useState<Entity[]>([]);
  const { isLoading } = useListUsers();

  const handleCloseDialog = () => {
    setSelectedUser(null),
    setSelectedGroupsForAssignment([]);
  };

  return (
    <>
      <Stack spacing={1}>
        {isLoading
          ? <CircularProgress /> :
            <div>
              <Stack 
                sx={{
                  paddingBottom: "8px"
                }}  
                direction="row" 
                spacing={2} 
                justifyContent="space-between" 
                alignItems="center"
              >
                <Typography variant="h5" component="h5">User Groups</Typography>
                <Button
                  variant={"contained"}
                  onClick={() => setSelectedUser(currentSelectedUser)}
                >
                  {"Assign New Group"}
                </Button>
              </Stack>
              <RemoveGroupFromUserWrapper selectedUser={currentSelectedUser}/>
            </div>
        }
      </Stack>
      {selectedUser && (
        <Dialog
          open
          onClose={handleCloseDialog}
          fullWidth
          maxWidth={"lg"}
        >
          <UserAssignmentContent 
            selectedUser={selectedUser} 
            selectedGroupsForAssignment={selectedGroupsForAssignment}
            setSelectedGroupsForAssignment={setSelectedGroupsForAssignment} 
            onClose={handleCloseDialog}
          />
        </Dialog>
      )}
      
    </>
  );
}

type UserAssignmentContentProps = { 
  selectedUser?: Entity, 
  selectedGroupsForAssignment?: Entity[], 
  setSelectedGroupsForAssignment?: React.Dispatch<React.SetStateAction<Entity[]>>, 
  onClose?: React.MouseEventHandler<HTMLElement> 
};

function UserAssignmentContent(props: UserAssignmentContentProps) {
  const { selectedUser, selectedGroupsForAssignment, setSelectedGroupsForAssignment, onClose } = props;
  
  const params: ListUsersParams = {};
  const { isLoading } = useListUsers(params);

  return (
    <PlaceholderStack>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <ListContainerStack>
          <ListContainer sx={{height: "68%", overflow: "auto"}}>
            <Typography variant="h6" component="h6" sx={{paddingBottom: "16px"}}>Available Groups: </Typography>
            <AssignGroupToUserWrapper 
              selectedUser={selectedUser} 
              selectedGroupsForAssignment={selectedGroupsForAssignment}
              setSelectedGroupsForAssignment={setSelectedGroupsForAssignment} 
              onClose={onClose}
            />
          </ListContainer>
          <ListContainer sx={{height: "32%", overflow: "auto"}}>
            <Typography variant="h6" component="h6" sx={{paddingBottom: "16px"}}>Selected Groups: </Typography>
            <SelectedGroupsForAssignmentWrapper
              selectedUser={selectedUser}  
              onClose={onClose}
              selectedGroupsForAssignment={selectedGroupsForAssignment}
              setSelectedGroupsForAssignment={setSelectedGroupsForAssignment} 
            />
          </ListContainer>
        </ListContainerStack>
      )}
    </PlaceholderStack>
  );
}

function AssignGroupToUserWrapper(props: UserAssignmentContentProps) {
  const { selectedUser, selectedGroupsForAssignment, setSelectedGroupsForAssignment } = props;

  const {
    data: availableGroupsForUser,
    isLoading,
    isFetching,
    error,
  } = useListUserGroups({ notContainedUser: selectedUser?.id });

  // console.log("These are the groups the user doesn't belong to ", availableGroupsForUser);

  return (
    <div >
      {error && <Alert severity="error">{error.message}</Alert>}
      <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>
        {(isFetching || isLoading) && <LinearProgress />}
      </Stack>
      <Stack justifyContent={"flex-start"} alignItems={"flex-start"} direction={"row"} spacing={2} useFlexGap flexWrap="wrap">
        {availableGroupsForUser?.map((availableGroupForUser: Entity) => (
          <AssignGroupToUser
            key={availableGroupForUser.id}
            availableGroupForUser={availableGroupForUser}
            selectedGroupsForAssignment={selectedGroupsForAssignment}
            setSelectedGroupsForAssignment={setSelectedGroupsForAssignment}
          />
          ))}
      </Stack>
    </div>
  );
}

function AssignGroupToUser(props: UserAssignmentContentProps & { availableGroupForUser: Entity }) {
  const { selectedGroupsForAssignment, setSelectedGroupsForAssignment, availableGroupForUser } = props;
  const [groupIsSelected, setGroupIsSelected] = React.useState(false);
  const invalidate = useInvalidate();
  const { isLoading: mutating } = useAssignUser({
    mutation: { onSettled: invalidate },
  });

  React.useEffect(() => {
    const availableGroupisInSelectedGroups = selectedGroupsForAssignment?.some(
      (selectedGroupForAssignment: Entity) => selectedGroupForAssignment.id === availableGroupForUser.id
    );

    if (availableGroupisInSelectedGroups !== undefined) {
      setGroupIsSelected(availableGroupisInSelectedGroups);
    }
  }, [selectedGroupsForAssignment, availableGroupForUser.id]);

  const addAvailableGroupToSelectedGroups = () => {
    if (selectedGroupsForAssignment && setSelectedGroupsForAssignment) {
    const availableGroupToAdd: Entity = {
      id: availableGroupForUser.id,
      name: availableGroupForUser.name,
    }
    setSelectedGroupsForAssignment([...selectedGroupsForAssignment, availableGroupToAdd]);
    }
  };

  const removeAvailableGroupFromSelectedGroups = () => {
    if (setSelectedGroupsForAssignment) {
      const availableGroupToRemove: Entity = {
        id: availableGroupForUser.id,
        name: availableGroupForUser.name,
      }
      const filteredSelectedGroupsForAssignment = selectedGroupsForAssignment?.filter(
        (selectedGroupForAssignment:Entity) => selectedGroupForAssignment.id !== availableGroupToRemove.id
      );
      if (filteredSelectedGroupsForAssignment !== undefined) {
        setSelectedGroupsForAssignment(filteredSelectedGroupsForAssignment);
      }
    }
  };

  const changeStatusofGroup = () => {
    !groupIsSelected ? addAvailableGroupToSelectedGroups() : removeAvailableGroupFromSelectedGroups();
  };

  return (
    <Button
      disabled={mutating}
      variant={!groupIsSelected ? "outlined" : "contained"}
      endIcon={!groupIsSelected ? <AddCircleOutlineIcon sx={{ color: "primary" }}/> : <CheckCircleOutlineIcon sx={{ color: "primary" }}/>}
      color={!groupIsSelected ? "primary" : "success"}
      onClick={() => {
        setGroupIsSelected(!groupIsSelected);
        changeStatusofGroup();
      }}
    >
      {availableGroupForUser.name}
    </Button>
  );
}

function SelectedGroupsForAssignmentWrapper(props: UserAssignmentContentProps) {
  const { selectedUser, onClose, selectedGroupsForAssignment, setSelectedGroupsForAssignment } = props;
  const invalidate = useInvalidate();
  const { mutate, isLoading: mutating } = useAssignUser({
    mutation: { onSettled: invalidate },
  });

  return (
    <Stack justifyContent={"space-between"} alignItems={"flex-start"} direction={"row"} spacing={1.5} useFlexGap flexWrap="wrap">
      <div style={{width: "80%"}}>
        {selectedGroupsForAssignment?.map((group: Entity) => 
          <Button
            variant={"outlined"}
            color={"secondary"}
            sx={{marginRight: "16px", marginBottom: "16px"}}
            endIcon={<RemoveCircleOutlineIcon sx={{ color: "red" }} />}
            key={group.id}
            onClick={() => {
              if (setSelectedGroupsForAssignment) {
                const filteredSelectedGroupsForAssignment = selectedGroupsForAssignment.filter(
                  (selectedGroupForAssignment:Entity) => selectedGroupForAssignment.id !== group.id
                );
                setSelectedGroupsForAssignment(filteredSelectedGroupsForAssignment);
              }
            }}
          > 
            {group.name}
          </Button>
        )}
      </div>
      <Stack sx={{width: "15%", alignSelf: "flex-end"}}>
        <Button
          sx={{marginBottom: "16px"}}
          disabled={mutating || selectedGroupsForAssignment?.length === 0}
          variant={"contained"}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            if (selectedUser && onClose && selectedGroupsForAssignment) {
              const selectedGroupsForAssignmentIds = selectedGroupsForAssignment?.map((selectedGroupForAssignment: Entity) => selectedGroupForAssignment.id);
              mutate({
                data: { userId: selectedUser.id, userGroupIds: [...selectedGroupsForAssignmentIds] },
              });
              onClose(event);
            } 
          }}
        >
          {"Assign"}
        </Button>
        <Button
          sx={{marginBottom: "16px"}}
          disabled={mutating || selectedGroupsForAssignment?.length === 0}
          variant={"contained"}
          onClick={() => {
            if (setSelectedGroupsForAssignment) {
              setSelectedGroupsForAssignment([]);
            }
          }}
        >
          {"Clear All"}
        </Button>
      </Stack>
    </Stack>
  );
}

function RemoveGroupFromUserWrapper(props: UserAssignmentContentProps) {
  const { selectedUser } = props;
  const {
    data: assignedGroupsToUser,
    isLoading,
    isFetching,
    error,
  } = useListUserGroups({ containedUser: selectedUser?.id });

  // console.log("These are the groups the user belongs to ", assignedGroupsToUser);

  return (
    <Stack spacing={1}>
      {error && <Alert severity="error">{error.message}</Alert>}
      <Stack justifyContent={"space-between"} direction={"row"} spacing={1}>
        {(isFetching || isLoading) && <LinearProgress />}
      </Stack>
      <Stack justifyContent={"flex-start"} alignItems={"flex-start"} direction={"row"} spacing={1.5} useFlexGap flexWrap="wrap">
        {assignedGroupsToUser && assignedGroupsToUser.length > 0 ?
          (assignedGroupsToUser?.map((assignedGroupToUser) => (
            <RemoveGroupFromUser
              key={assignedGroupToUser.id}
              selectedUser={selectedUser}
              assignedGroupToUser={assignedGroupToUser}
            />
          ))) : (<Alert severity="info">There are no assigned groups to display.</Alert>
          )}
      </Stack>
    </Stack>
  );
}

function RemoveGroupFromUser(props: UserAssignmentContentProps & { assignedGroupToUser: Entity }) {
  const { selectedUser, assignedGroupToUser } = props;
  const invalidate = useInvalidate();
  const { mutate, isLoading: mutating } = useRemoveUser({
    mutation: { onSettled: invalidate },
  });

  return (
    <Button
      endIcon={<RemoveCircleOutlineIcon sx={{ color: "red" }} />}
      sx={{
        width: "fit-content",
      }}
      disabled={mutating}
      variant="outlined"
      color="secondary"
      onClick={() => {
        if (selectedUser) {
          mutate({
            data: { userId: selectedUser.id, userGroupIds: [assignedGroupToUser.id] },
          });
        }
      }}
    >
      {assignedGroupToUser.name}
    </Button>
  );
}

const PlaceholderStack = styled((props: StackProps) => (
  <Stack
    spacing={4}
    alignItems={"center"}
    justifyContent={"flex-start"}
    {...props}
  />
))({ width: "100%", height: 670, boxSizing: "border-box", padding: 16 });

const ListContainerStack = styled((props: StackProps) => (
  <Stack direction={"column"} spacing={1} {...props} />
))({ width: "100%", height: "100%", boxSizing: "border-box" });

const ListContainer = styled("div")({
  width: "100%",
  boxSizing: "border-box",
  padding: 16,
  border: "1px solid #d3d3d3",
  borderRadius: 6,
});
