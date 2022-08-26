import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import {ethers} from 'ethers'

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0")

    const {runContractFunction : enterRaffle} = useWeb3Contract({
        abi : abi ,
        contractAddress : raffleAddress,
        functionName : "enterRaffle",
        params: {} ,
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {}, 
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            async function updateUI() {
                const entranceFeeFromCall = (await getEntranceFee()).toString()
                setEntranceFee(entranceFeeFromCall)
            }
            updateUI()
        }
    }, [isWeb3Enabled])

    return (
        <div>Hi from lottery contract! 
            {raffleAddress ? 
            (<div>

                <button onClick={async () => {
                    await enterRaffle()
                }}>Enter raffle</button>
                <div>
                Entrance fees is : {(ethers.utils.formatUnits(entranceFee,"ether")) } ETH
                </div>
            </div> )
            : (<div>No raffle address detected!</div>)}
         </div>)
}