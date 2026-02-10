
import QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
 
interface Noti {
  tableId: string | undefined;
  roomId: string;
}

// scanner={scanner} setShowScanner={setShowScanner}
export default function Scanner(
  { scanner, 
    setShowScanner, 
    setScanStatus,
    onScanSuccess
  }: {
    scanner: boolean,
    setShowScanner: React.Dispatch<React.SetStateAction<boolean>>,
    setScanStatus: React.Dispatch<React.SetStateAction<number>>,
    onScanSuccess?: (result: string) => void,
  }) {
    const videoElementRef = useRef(null);
    const searchParams = useSearchParams();
    const [showNoti, setShowNoti] = useState<boolean>(false)
    const [scannedUrl, setScannedUrl] = useState<string>('')

    const [data, setData] = useState<Noti>()
    // useEffect(() => {
    //   console.log(data)
    // }, [data])
    function queryString(url:string) {
      const str1 = url.split('?')[1];
      const params = {} as any;
  
      if (str1) {
          const pairs = str1.split('&');
          for (const pair of pairs) {
              const [key, value] = pair.split('=');
              params[key] = decodeURIComponent(value
                            .replace(/\+/g, ' '));
          }
      }
  
      return params as Noti;
  }
    const roomId = searchParams.get('roomId') || '';
    const tableId = searchParams.get('tableId');

    useEffect(() => {
        if (!scanner) {
          return;
        }
        setData({
          roomId: roomId,
          tableId: tableId || '',
        })
  

        const video: HTMLVideoElement = videoElementRef.current as any;
        const qrScanner = new QrScanner(
        video,
        (result) => {
          void queryString(result.data);
          setScannedUrl(result.data);
          
          // If onScanSuccess callback is provided, use it instead of direct redirect
          if (onScanSuccess) {
            onScanSuccess(result.data);
          } else {
            window.location.href = result.data;
          }
        },
        {
            returnDetailedScanResult: true,
            highlightScanRegion: true,
            highlightCodeOutline: true,
        }
        );
        setScanStatus(1);
        qrScanner.start();

        return () => {
          setScanStatus(0);
          qrScanner.stop();
          qrScanner.destroy();
        };
    }, [scanner, roomId, tableId, setScanStatus]);

    const Noti = (props: any) => {
      const notiElement = document.getElementById('noti');
      const NotiStyles: React.CSSProperties = {
        maxWidth: 300,
        width: '70%',
        height: 150,
        backgroundColor: '#D9D9D9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        position: 'fixed',
        gap: 5,
        top: 'calc(50% - 75px)',
        left: `calc(50% - ${notiElement?.offsetHeight})`,
        zIndex: 1000
      }
      return(
        <div id='noti' style={NotiStyles}>
          <p style={{ fontSize: 14, margin: 0 }}>
            Bạn có muốn tìm hiểu thêm về trường <b>Đại học Kinh tế - Đại học Đà Nẵng</b> không?
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
              gap: 5,
              width: '100%'
            }}
          >
            <button
              type="button"
              onClick={() => {
                setShowNoti(false);
                setShowScanner(false);
                window.location.href = scannedUrl;
              }}
              style={{
                width: '100px',
                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                background: '#DB3022',
                color: 'white',
                fontSize: '14px',
                fontWeight: 700,
                padding: '5px',
                borderRadius: '50px',
                border: 'solid 2px #DB3022',
                textTransform: 'capitalize',
                height: '40px',
                cursor: 'pointer'
              }}
            >
              Không
            </button>
            <button
              type="button"
              style={{
                width: '100px',
                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                background: '#DB3022',
                color: 'white',
                fontSize: '14px',
                fontWeight: 700,
                padding: '5px',
                borderRadius: '50px',
                border: 'solid 2px #DB3022',
                textTransform: 'capitalize',
                height: '40px',
                cursor: 'pointer'
              }}
            >
              Có
            </button>
          </div>
        </div>
      )
    }
  
    return (
        <>
            <div className="w-full h-full">
                <video className="w-full h-full object-cover" ref={videoElementRef} />
            </div>
            { showNoti ? <Noti tableId={data?.tableId}/> : "" } \
        </>
    )
}
