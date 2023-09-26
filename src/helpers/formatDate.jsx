

export const formatDate = (date) => {

    const dateNew = new Date(date);

    const optionsDate = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }

    return dateNew.toLocaleDateString('es-ES', optionsDate)
};

