import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import { useWeb3React } from "@web3-react/core"
import { loadNFTInfo, approveArtGobbler, isNFTApproved, gobble } from '../../contract/contract'
import { Button } from '@mui/material';

const Page = () => {

    const [ nftAddress, setNFTAddress ] = useState("")
    const [ nftApproved, setNFTApproved ] = useState(false)
    const [ nftId, setNFTId ] = useState("")
    const [ nftInfo, setNftInfo ] = useState({})
    const [ gobblerId, setGobblerId] = useState("")

    const { active, account, library, connector, activate, deactivate, chainId } = useWeb3React()

    const getNFTInfo = async() => {
        const nftInfo = await loadNFTInfo(nftAddress, nftId)
        setNftInfo(nftInfo)
    }

    const checkNFTApproved = async () => {
        const result = await isNFTApproved(account, nftAddress)
        console.log(result)
        setNFTApproved(result)
    }

    const approve = async () => {
        toast.success('transaction pending...')
        try {
            const result = await approveArtGobbler(
                library, account, nftAddress
            )
            console.log(result)
            checkNFTApproved()
            toast.success('transaction confirmed!')
        } catch(e) {
            toast.error(e.message)
            console.log(e)
        }

    }

    const feedNFT = async () => {
       toast.success('transaction pending...')
       try {
          const result = await gobble(
            library, 
            account, 
            gobblerId, 
            nftAddress, 
            nftId, 
            false
          )
          console.log(result)
          await loadNFTInfo(nftAddress, nftId)
          toast.success('transaction confirmed!')
       } catch (e) {
          toast.error(e.message)
          console.log(e)
       }
    }
 
    useEffect(() => {
        if(nftAddress && nftId) {
            console.log("38")
            getNFTInfo()
        }
    }, [nftAddress, nftId])

    useEffect(() => {
        if(nftAddress && account) {
            checkNFTApproved()
        }
    }, [nftAddress])

    return <Box 
                display='flex' 
                justifyContent={'center'} 
                alignItems='center'

                style={{flexDirection: 'column', background: "#F3F6FB", paddingTop: "5%", paddingBottom: '5%'}}
            >
                <Box>
                    <Typography variant="h2" component="div" gutterBottom>
                        <span style={{fontWeight: 'bold', textAlign: "center"}}>
                        Import NFT
                        </span>
                    </Typography>
                </Box>

                <Box style={{width: "100%"}}>
                    <TextField 
                        id="outlined-basic" 
                        label="Contract Address" 
                        value={nftAddress}
                        style={{width: "50%", marginLeft: "25%"}}
                        onChange={(e) => {setNFTAddress(e.target.value)}}
                    />
                </Box>

                <Box style={{marginTop: 30}}>
                    <TextField 
                        id="outlined-basic" 
                        label="NFT ID" 
                        variant="outlined"
                        value={nftId}
                        onChange={(e) => {setNFTId(e.target.value)}}
                    />
                </Box>

                {
                    nftInfo.imageUrl && <img src={nftInfo.imageUrl} style={{width: 300, height: 300, marginTop: 30}}/>
                }

                {
                    nftInfo.owner &&  <Typography variant="p1" component="div" gutterBottom style={{marginTop: 20}}>
                                        owner: {nftInfo.owner}
                                      </Typography>
                }

                {
                    nftInfo.owner  && <>
                                        <Box style={{marginTop: 20, marginBottom: 20}}>
                                            Gobbler id: <input 
                                                            value={gobblerId} 
                                                            onChange={(e) =>{setGobblerId(e.target.value)}}
                                                        />
                                        </Box>
                                        <Box>
                                            {
                                                nftApproved ? <Button 
                                                                    variant="contained" 
                                                                    size="large"
                                                                    onClick={feedNFT}
                                                              >
                                                                    Feed to Gobbler
                                                                </Button> :
                                                                <Button 
                                                                    variant="contained" 
                                                                    size="large"
                                                                    onClick={approve}
                                                                >
                                                                    Approve Before Feed
                                                                </Button>
                                            }
                           
                                        </Box>
                                      </>
                }


           </Box>
}

export default Page