'use client'

import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from "sonner"
import { upsertFunnelPage } from '@/lib/queries'
import { DeviceTypes, useEditor } from '@/providers/editor/editor-provider'
import { FunnelPage } from '@prisma/client'
import clsx from 'clsx'
import { ArrowLeftCircle, Laptop, Smartphone, Tablet } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { FocusEventHandler, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Props = {
    funnelId : string,
    funnelPageDetails : FunnelPage,
    subaccountId : string
}

const FunnelEditorNavigation = ({funnelId, funnelPageDetails, subaccountId}: Props) => {
    const router = useRouter()
    const {state, dispatch} = useEditor()

    useEffect(()=> {
        dispatch({
            type : "SET_FUNNELPAGE_ID",
            payload : {funnelPageId : funnelPageDetails.id}
        })
    }, [funnelPageDetails])

    const handleOnBlurTitleChnage:FocusEventHandler<HTMLInputElement> = async(event) => {
        if (event?.target.value ===  funnelPageDetails.name) return 
        if (event.target.value) {   
            await upsertFunnelPage(
            subaccountId,
            {
                id : funnelPageDetails.id,
                name : event.target.value,
                order : funnelPageDetails.order
            }, 
            funnelId)

            toast("Success", {
                description : "Saved funnel page title"
            })
            router.refresh()
        }else {
            toast("Oppse!", {
                description : "You need to have a title!"
            })
            event.target.value = funnelPageDetails.name
        }
    }
  return (
    <TooltipProvider>
        <nav
            className={clsx(
                'border-b-[1px] flex items-center justify-between p-6 gap-2 transition-all',
                {'!h-0 !p-0 !overflow-hidden' : state.editor.previewMode}
            )}
        >
            <aside
                className='flex items-center gap-4 max-w-[260px] w-[300px]'
            >
                <Link
                    href={`/subaccount/${subaccountId}/funnels/${funnelId}`}
                >
                    <ArrowLeftCircle/>
                </Link>
                <div className='flex flex-col w-full'>
                    <Input
                        defaultValue={funnelPageDetails.name}
                        className='border-none h-5 m-0 p-0 text-lg'
                        onBlur={handleOnBlurTitleChnage}
                    />
                    <span className='text-sm text-muted-foreground'>
                        Path: /{funnelPageDetails.pathName}
                    </span>
                </div>
            </aside>
            <aside>
                <Tabs
                    defaultValue='Desktop'
                    className='w-fit'
                    value={state.editor.device}
                    onValueChange={(value)=>{
                        dispatch({
                            type : "CHANGE_DEVICE",
                            payload : {
                                device : value as DeviceTypes
                            }
                        })
                    }}
                >
                    <TabsList className="grid w-full grid-cols-3 bg-transparent h-fit">
                        <Tooltip>
                            <TooltipTrigger>
                            <TabsTrigger
                                value="Desktop"
                                className="data-[state=active]:bg-muted w-10 h-10 p-0"
                            >
                                <Laptop/>
                            </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                            <p>Desktop</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                            <TabsTrigger
                                value="Tablet"
                                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                            >
                                <Tablet />
                            </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                            <p>Tablet</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                            <TabsTrigger
                                value="Mobile"
                                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                            >
                                <Smartphone />
                            </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                            <p>Mobile</p>
                            </TooltipContent>
                        </Tooltip>
                    </TabsList>
                </Tabs>
            </aside>
        </nav>
    </TooltipProvider>
  )
}

export default FunnelEditorNavigation