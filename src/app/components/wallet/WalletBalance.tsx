'use client'

import { PlusIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import CustomImage from './CustomImage'
import { MobileDepositForm } from './MobileDepositForm'
import { MobileWithdrawalForm } from './MobileWithdrawalForm'
import MobileWithdrawalPinForm from './MobileWithdrawalPinForm'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'
import { formatNaira } from '@/app/utils/utils'
import { EyeIcon, EyeSlash } from '@/app/icons/icons'
import { MobileSuccessDeposit } from './MobileSuccessDeposit'
import { useParams } from 'next/navigation'
import QmDrawer from '../drawer/drawer'
import { useAuth } from '@/app/hooks/useAuth'
import { useWalletBalance } from '@/lib/queries'

export default function WalletBalance() {
  const [open, setOpen] = useState(false)
  const { success } = useParams()
  const [isSuccessfulDepositOpen, setIsSuccessfulDepositOpen] = useState(
    Boolean(success)
  )
  const [withdrawalModal, setWithdrawalModal] = useState(false)
  const [withdrawalPinModal, setWithdrawalPinModal] = useState(false)
  const [isBalanceHidden, setIsBalanceHidden] = useState(false)

  const { data: walletBalance, isLoading: isWalletLoading } = useWalletBalance()
  const balanceKobo = walletBalance?.balance ?? 0

  const { user } = useAuth()

  return (
    <>
      <div className="bg-[#17478B] text-white py-12 px-8 rounded-3xl relative overflow-hidden w-full shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-95 bg-[url('/assets/images/background.png')] lg:bg-[url('/assets/images/background-desktop.png')] bg-cover bg-center bg-no-repeat">
        <div className="space-y-4 relative z-10">
          <p className="text-base opacity-90 text-center">My NGN Wallet</p>

          {isWalletLoading ? (
            <Loader className="animate-spin size-3 text-white" />
          ) : (
            <h1 className="md:text-4xl text-2xl font-bold text-center flex items-center justify-center gap-1">
              <span>
                {isBalanceHidden
                  ? '****'
                  : formatNaira(balanceKobo, true)}
              </span>
              <button
                onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                className="cursor-pointer"
              >
                {isBalanceHidden ? <EyeSlash /> : <EyeIcon />}
              </button>
            </h1>
          )}

          <div className="flex gap-1 md:gap-4 mt-6 px-2 md:px-0 justify-center">
            <QmDrawer
              open={open}
              onOpenChange={setOpen}
              title="Deposit"
              titleLeft
              heightClass="h-[75%] md:h-[45%] lg:h-[65%]"
              trigger={
                <button
                  onClick={() => setOpen(true)}
                  className="bg-[#3386CE] cursor-pointer hover:bg-primary-700 px-4 py-2 text-sm rounded-full flex items-center gap-2 font-medium md:px-6 md:py-3 md:text-base"
                >
                  Deposit
                  <span className="font-bold">
                    <PlusIcon className="text-white w-4 h-4 md:w-5 md:h-5 hidden md:block" />
                  </span>
                </button>
              }
            >
              <MobileDepositForm close={() => setOpen(false)} />
            </QmDrawer>

            <QmDrawer
              open={withdrawalModal}
              onOpenChange={(val) => {
                if (user?.pinSetup && val === true) {
                  setWithdrawalModal(val)
                  return
                } else if (!user?.pinSetup && val === true) {
                  setWithdrawalPinModal(true)
                  return
                }
                setWithdrawalModal(val)
              }}
              title="Withdraw"
              titleLeft
              heightClass="h-[75%] md:h-[55%] lg:h-[80%]"
              trigger={
                <button
                  className="bg-[#E4F1FA] cursor-pointer hover:bg-gray-100 text-primary-700 px-4 py-2 text-sm rounded-full flex items-center gap-0 md:gap-2 font-medium md:px-6 md:py-3 md:text-base"
                >
                  Withdraw{' '}
                  <CustomImage
                    alt=""
                    src={'/icons/arrow-up.svg'}
                    className="w-2 h-2 md:w-5 md:h-5 hidden md:block"
                  />
                </button>
              }
            >
              <MobileWithdrawalForm
                onAddBank={() => {
                  toast.info('Add a payout account first', {
                    position: 'top-right',
                  })
                  setWithdrawalModal(false)
                }}
              />
            </QmDrawer>
          </div>
        </div>
      </div>

      <QmDrawer
        open={withdrawalPinModal}
        onOpenChange={setWithdrawalPinModal}
        title="Withdrawal Pin"
        titleLeft
        heightClass="h-[75%] md:h-[55%] lg:h-[80%]"
      >
        <MobileWithdrawalPinForm
          onSubmit={() => {
            setWithdrawalPinModal(false)
            toast.success('Withdrawal pin set successfully!')
          }}
        />
      </QmDrawer>

      <QmDrawer
        open={isSuccessfulDepositOpen}
        onOpenChange={setIsSuccessfulDepositOpen}
        heightClass="h-[75%] lg:h-auto"
      >
        <MobileSuccessDeposit
          title={Boolean(success) ? 'Successful !' : 'Failed !'}
        />
      </QmDrawer>
    </>
  )
}
