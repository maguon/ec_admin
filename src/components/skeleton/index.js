import Skeleton from '@material-ui/lab/Skeleton';

export const NavAvatarSkeleton = ()=>{
    return (
        <div style={{display: "flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>                          
            <Skeleton variant="circle" width={40} height={40} />
            <Skeleton variant="rect" width={210} height={32} />
            <Skeleton variant="rect" width={210} height={20} />
        </div>
    )
}