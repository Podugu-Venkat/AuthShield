
const FloatingShape = ({ color, size, top, left, delay }) => {
	return (
		<motion.div
			className={`absolute rounded-full ${color} ${size} opacity-30`}
			style={{ top, left }}
			animate={{
				y: ['0%', '-20%', '0%'],
				x: ['0%', '10%', '0%'],
				rotate: [0, 360],
			}}
			transition={{
				duration: 10,
				ease: 'linear',
				repeat: Infinity,
				delay,
			}}
		/>
	);
};

export default FloatingShape;
