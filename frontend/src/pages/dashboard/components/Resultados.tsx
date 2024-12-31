import 'react-image-crop/dist/ReactCrop.css'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from '../Dashboard.module.css'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Badge from 'react-bootstrap/Badge';
import Skeleton from 'react-loading-skeleton'
import Stack from 'react-bootstrap/Stack';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { memo, useMemo, useEffect, useId, useState } from 'react';
import ReactCrop from 'react-image-crop';
import { KeyedMutator } from 'swr'
import Cookies from 'universal-cookie';
import { FiMoreVertical, FiPlay, FiPlayCircle, FiPlusCircle, FiSearch, FiStopCircle, FiTrash } from 'react-icons/fi';
import { generateApiUrl, API_WEB_SCREENSHOT_URL } from '@/lib/constants';
import fetcher from '@/util/fetcher';
import { useAuth } from '@/providers/auth/AuthProvider';
import moment from 'moment';

interface IResultadosListaProps {
  resultados?: any
  isLoading: boolean
  error: Error
  mutate: KeyedMutator<any>
  onSelect: (_result: any) => void
  onClick: (_true: boolean) => void
  onError?: () => string
}

const ResultadoItem = ({
  resultado,
  onPause,
  onClear,
  onSelect,
  onClick
}: {
  resultado: any
  onPause: () => void
  onClear: () => void
  onSelect: (pagina: any) => void
  onClick: (show: boolean) => void
}) => {
  const { currentUser } = useAuth()
  moment.locale('es-mx');
  return (
    <ListGroup.Item action className="d-flex justify-content-between align-items-start" onClick={() => { onSelect(resultado), onClick(true) }}>
      <div className="ms-2 me-auto">
        <div className="fw-bold">Diferencia encontrada: {resultado.diferencia}%</div>
        Monitoreo realizado el {moment(resultado.tiempoChequeo).format('DD/MM/YYYY [a las] h:mm:ss a')}
      </div>
      {/* <small>
        <DropdownButton
          variant="link"
          title={<FiMoreVertical />}
          className=''
        >
          <Dropdown.Item onClick={() => undefined}><FiStopCircle /> Ver detalles</Dropdown.Item>
        </DropdownButton>
      </small> */}
    </ListGroup.Item>
  )
}

const MemoizedResultado = memo(ResultadoItem, (prevProps, nextProps) => {
  return (
    prevProps.resultado.id === nextProps.resultado.id,
    prevProps.resultado.tiempoChequeo === nextProps.resultado.tiempoChequeo,
    prevProps.resultado.diferencia === nextProps.resultado.diferencia
  )
})

const actualizarPaginasInfo = (
  posts: any[],
  target: any,
) => {
  // Update the posts data in the cache
  return posts.map(p => {
    if (p.id === target.id) {
      return {
        ...p
      }
    }
    return p
  })
}

export default function ListaResultados({
  resultados,
  isLoading,
  error,
  mutate,
  onSelect,
  onClick,
  onError
}: IResultadosListaProps) {
  const onPause = (page: any) => {
    fetch(generateApiUrl(`/api/v1/pages/${page.uuid}/pause`), {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${new Cookies().get('token')}`
      },
    }).then(res => {
      if (res.ok) {
        // mutate posts
        mutate()
      } else {
        console.log('Fallo al poner monitoreo de página en pausa')
      }
    })
  }

  const onClear = (page: any) => {
    fetch(generateApiUrl(`/api/v1/pages/${page.uuid}`), {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${new Cookies().get('token')}`
      },
    }).then(res => {
      if (res.ok) {
        // mutate posts
        mutate()
      } else {
        console.log('Fallo al eliminar página para monitoreo')
      }
    })
  }

  const onErrorFun = (msg: string) => msg;

  if (error || !resultados) {
    return (
      <Alert variant="danger">
        <Alert.Heading>¡Un error!</Alert.Heading>
        <p>
          Parece que aún no hay resultados de monitoreo para mostrar.
        </p>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <ListGroup>
        <ListGroup.Item as='li' className="d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto" style={{ width: '100%' }}>
            <div className="fw-bold"><Skeleton /></div>
            <Skeleton />
          </div>
        </ListGroup.Item>
        <ListGroup.Item as='li' className="d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto" style={{ width: '100%' }}>
            <div className="fw-bold"><Skeleton /></div>
            <Skeleton />
          </div>
        </ListGroup.Item>
        <ListGroup.Item as='li' className="d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto" style={{ width: '100%' }}>
            <div className="fw-bold"><Skeleton /></div>
            <Skeleton />
          </div>
        </ListGroup.Item>
      </ListGroup >
    )
  }



  return (
    <>
      {resultados.data?.managedPagesResults?.length ? (
        <ListGroup>
          {resultados.data.managedPagesResults.map((item: any) => (
            <MemoizedResultado
              key={item.id}
              resultado={item}
              onPause={() => onPause(item)}
              onClear={() => onClear(item)}
              onSelect={() => onSelect(item)}
              onClick={() => onClick(true)}
            />
          ))}
        </ListGroup>
      ) : (
        <Alert variant="warning">
          <Alert.Heading>¡Sin resultados!</Alert.Heading>
          <p>
            Esta página no tiene resultados o aún no se ha realizado el monitoreo.
          </p>
        </Alert>
      )}

    </>
  )
}