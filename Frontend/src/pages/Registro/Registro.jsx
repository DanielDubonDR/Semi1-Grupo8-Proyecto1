import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Service from '../../Service/Service';
import { useUserContext } from '../../context/UserContext';
function Registro(){
    const style_font = {
        fontFamily: "'Quicksand', sans-serif",
    };

	const {logueado, setLogueado} = useUserContext();

	useEffect(() => {
		console.log(logueado)
		if(logueado){
		  navigate('/user/home');
		}
	}, [logueado])

	const[Nombres, setNombres] = useState('');
	const[Apellidos, setApellidos] = useState('');
	const[Correo, setCorreo] = useState('');
	const[FechaNacimiento, setFechaNacimiento] = useState('');
	const[Contrasena, setContrasena] = useState('');
	const[ConfirmarContrasena, setConfirmarContrasena] = useState('');
	const[Foto, setFoto] = useState(null);
	const[namephoto, setNamephoto] = useState('Selecciona tu foto');
	const navigate = useNavigate();
	const handleSubmit = (e) =>{
		e.preventDefault();
	}

	const onChangeNombres = (e) =>{
		console.log(e.target.value);
		setNombres(e.target.value);
	}

	const onChangeApellidos = (e) =>{
		setApellidos(e.target.value);
	}

	const onChangeCorreo = (e) =>{
		setCorreo(e.target.value);
	}

	const onChangeFechaNacimiento = (e) =>{
		console.log(e.target.value);
		setFechaNacimiento(e.target.value);
	}

	const onChangeContrasena = (e) =>{
		setContrasena(e.target.value);
	}

	const onChangeConfirmarContrasena = (e) =>{
		setConfirmarContrasena(e.target.value);
	}

	const handleValidacionRegistro = () =>{
		if(Nombres === '' || Apellidos === '' || Correo === '' || FechaNacimiento === '' || Contrasena === '' || ConfirmarContrasena === ''){
			alert('Todos los campos son obligatorios');
			return;
		}
		if(Contrasena !== ConfirmarContrasena){
			alert('Las contraseñas no coinciden');
			return;
		}
		if(Foto === null){
			alert('Debes cargar una foto');
			return;
		}
		
		const formData = new FormData();
		formData.append('nombres', Nombres);
		formData.append('apellidos', Apellidos);
		formData.append('correo', Correo);
		formData.append('password', Contrasena);
		formData.append('fecha_nac', FechaNacimiento);
		formData.append('imagen', Foto);

		try{
			Service.registro(formData)
			.then(response => {
				if(response.status){
					alert('Usuario registrado correctamente');
					navigate('/login')
				}
			})
		}catch(error){
			console.log(error);
		}

	}
	const onChangeFoto = (e) =>{
		const selectedFile = e.target.files[0];
		console.log(selectedFile)
		setNamephoto(selectedFile.name);
		setFoto(selectedFile);
	}

    return (
        <div className="h-screen md:flex fuente">
	<div
		className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-lightPurple to-purple-700 i justify-around items-center hidden" style={{ 
            backgroundImage: "url('https://i.postimg.cc/k4YCHt8n/mujer-auriculares-inalambricos-escuchando-sus-canciones-favoritas-relajada-ojos-cerrados-luz-neon.jpg')", 
            backgroundColor: "rgba(127, 63, 191, 0.7)",
            backgroundSize: "cover", 
            backgroundPosition: "center center" }}>
		<div>
        <img src="http://imgfz.com/i/6mHNsRq.png"
              className="w-50 mx-auto" alt="Logo" />
		</div>
	</div>
	<div className="flex md:w-1/2 justify-center py-10 items-center bg-black" style={style_font}>
		<form className="bg-black" onSubmit={handleSubmit}>
			<h1 className="text-white font-bold text-4xl mb-1 ">Bienvenido, Regístrate!</h1>
			<p className="text-s font-normal text-white mb-7">A la mejor plataforma de música!</p>
			<div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lightPurple" viewBox="0 0 20 20"
					fill="currentColor">
					<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
						clip-rule="evenodd" />
				</svg>
				<input className="pl-2 outline-none border-none bg-black text-white" 
					type="text" 
					name="name_user" 
					id="name_user" 
					placeholder="Nombres" 
					onChange={onChangeNombres}
					value={Nombres}
					required
				/>
      </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lightPurple" viewBox="0 0 20 20"
					fill="currentColor">
					<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
						clip-rule="evenodd" />
				</svg>
				<input className="pl-2 outline-none border-none bg-black text-white" 
					type="text" 
					name="apellido_user" 
					id="apellido_user" 
					placeholder="Apellidos" 
					onChange={onChangeApellidos}
					value={Apellidos}
					required/>
      </div>
      
					<div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lightPurple" fill="none"
							viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
						</svg>
						<input className="pl-2 outline-none border-none bg-black text-white" 
							type="email" 
							name="email_user" 
							id="email_user" 
							placeholder="Correo Electrónico"
							onChange={onChangeCorreo}
							value={Correo} 
							required/>
      </div>
                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lightPurple" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
</svg>



							<input className="pl-2 outline-none border-none bg-black text-white" 
								type="date" 
								name="date_user" 
								id="date_user" 
								placeholder="Año de Nacimiento"
								onChange={onChangeFechaNacimiento}
								value={FechaNacimiento} 
								required/>
      </div>
                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lightPurple" viewBox="0 0 20 20"
								fill="currentColor">
								<path fill-rule="evenodd"
									d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
									clip-rule="evenodd" />
							</svg>
							<input className="pl-2 outline-none border-none bg-black text-white" 
								type="password" 
								name="pass_user" 
								id="pass_user" 
								placeholder="Contraseña" 
								onChange={onChangeContrasena}
								value={Contrasena}
								required/>
      </div>
                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lightPurple" viewBox="0 0 20 20"
								fill="currentColor">
								<path fill-rule="evenodd"
									d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
									clip-rule="evenodd" />
							</svg>
							<input className="pl-2 outline-none border-none bg-black text-white" 
							type="password" 
							name="pass_user2" 
							id="pass_user2" 
							placeholder="Confirmar Contraseña"
							onChange={onChangeConfirmarContrasena}
							value={ConfirmarContrasena} 
							required/>
      </div>
      <label className="flex items-center border-2 py-2 px-3 rounded-2xl cursor-pointer">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lightPurple" viewBox="0 0 16 16" fill="currentColor">
        <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
        <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
    </svg>
    <input className="hidden" 
			type="file" 
			accept="image/*" 
			capture="camera" 
			name="photo_user" 
			id="photo_user" 
			onChange={onChangeFoto}
			required
			/>
    <span className="pl-2 outline-none border-none bg-black text-white" style={{ pointerEvents: "none" }}>{namephoto}</span>
</label>


							<button type="submit" className="block w-full bg-lightPurple mt-4 py-2 rounded-2xl text-white font-semibold mb-2" onClick={handleValidacionRegistro}>Registrar</button>
							<p className='text-sm ml-2 text-white'>Acaso ya tienes cuenta ? 
                            <Link to="/" className="text-sm ml-2 hover:text-white cursor-pointer text-lightPurple">Inicia Sesión</Link></p>
		</form>
	</div>
</div>
    );
}

export default Registro;