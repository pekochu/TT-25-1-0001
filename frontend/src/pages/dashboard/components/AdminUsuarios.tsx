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
import { FiMoreVertical, FiMail, FiCheckCircle, FiPlayCircle, FiPlusCircle, FiSearch, FiStopCircle, FiTrash } from 'react-icons/fi';
import { generateApiUrl, API_WEB_SCREENSHOT_URL } from '@/lib/constants';
import fetcher from '@/util/fetcher';
import { useAuth } from '@/providers/auth/AuthProvider';

interface IUsuariosListaProps {
  users?: any
  isLoading: boolean
  error: Error
  mutate: KeyedMutator<any>
  onSelect: (_pagina: any) => void
  onError?: () => string
}

const UserItem = ({
  user,
  onPause,
  onClear,
  onSelect
}: {
  user: any
  onPause: () => void
  onClear: () => void
  onSelect: (user: any) => void
}) => {
  const { currentUser } = useAuth()

  return (
    <ListGroup.Item action className="d-flex justify-content-between align-items-start" onClick={() => onSelect(user)}>
      <div className="ms-2 me-auto">
        <div><span className="">{user.nombre} | </span>{user.rol === 0 ? (<span className="fw-bold">Administrador</span>) : (<span className="fw-bold">Cliente</span>)}</div>
        Correo: <span><a href={`mailto:${user.email}`}>{user.email}</a></span>
      </div>
      <small>
        <DropdownButton
          variant="link"
          title={<FiMoreVertical />}
          className=''
        >
          <Dropdown.Item onClick={onPause}><FiMail /> Enviar link para recuperar cuenta</Dropdown.Item>
          <Dropdown.Item onClick={onPause}><FiCheckCircle /> Activar cuenta</Dropdown.Item>
          <Dropdown.Item onClick={onPause}><FiStopCircle /> Desactivar cuenta</Dropdown.Item>
          <Dropdown.Item onClick={onClear}><FiTrash /> Eliminar</Dropdown.Item>
        </DropdownButton>
      </small>
    </ListGroup.Item>
  )
}

const MemoizedUser = memo(UserItem, (prevProps, nextProps) => {
  return (
    prevProps.user.id === nextProps.user.id,
    prevProps.user.nombre === nextProps.user.nombre,
    prevProps.user.email === nextProps.user.email
  )
})

const actualizarusersInfo = (
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

export default function ListaUsers({
  users,
  isLoading,
  error,
  mutate,
  onSelect,
  onError
}: IUsuariosListaProps) {
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

  if (isLoading || !users) {
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

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>¡Un error!</Alert.Heading>
        <p>
          Ha ocurrido un error tratando de obtener tus páginas a monitorear.
        </p>
      </Alert>
    )
  }

  return (
    <>
      {users.data?.length ? (
        <ListGroup>
          {users.data.map((item: any) => (
            <MemoizedUser
              key={item.id}
              user={item}
              onPause={() => onPause(item)}
              onClear={() => onClear(item)}
              onSelect={() => onSelect(item)}
            />
          ))}
        </ListGroup>
      ) : (
        <Alert variant="warning">
          <Alert.Heading>¡Este sistema aún no tiene usuarios!</Alert.Heading>
          <p>
            Qué raro, deberías poder ver al menos tu propio user
          </p>
        </Alert>
      )}

    </>
  )
}